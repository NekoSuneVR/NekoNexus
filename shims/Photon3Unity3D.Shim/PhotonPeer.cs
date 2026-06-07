using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using LiteNetLib;
using LiteNetLib.Utils;
using Paradise.Transport;

namespace ExitGames.Client.Photon {
	// Drop-in for ExitGames.Client.Photon.PhotonPeer, backed by LiteNetLib. Implements
	// exactly the surface UberStrike.Realtime.Client.BasePeer drives.
	public class PhotonPeer : INetEventListener {
		private readonly IPhotonPeerListener _listener;
		private readonly NetManager _net;
		private NetPeer _server;
		private PeerStateValue _state = PeerStateValue.Disconnected;
		private int _serverTimeOffsetMs;        // localTick + offset ≈ server time

		public ConnectionProtocol UsedProtocol { get; private set; }
		public DebugLevel DebugOut { get; set; } = DebugLevel.ERROR;
		public string ServerAddress { get; private set; }

		// Same connection key the server's RealtimeHost expects to gate connections.
		public static string ConnectionKey = "Paradise";

		public PhotonPeer(IPhotonPeerListener listener, ConnectionProtocol protocolType) {
			_listener = listener ?? throw new ArgumentNullException(nameof(listener));
			UsedProtocol = protocolType;
			_net = new NetManager(this) {
				AutoRecycle = true,
				UnconnectedMessagesEnabled = false,
				ChannelsCount = 4,
				UpdateTime = 10,
				// Bind IPv4-only. Many players have IPv6 disabled/broken, where creating the
				// IPv6 socket throws "An address incompatible with the requested protocol was
				// used" and kills the connect. The realtime servers are IPv4, so we never need v6.
				IPv6Enabled = IPv6Mode.Disabled,
			};
		}

		public PeerStateValue PeerState => _state;
		public int RoundTripTime => _server?.Ping * 2 ?? 0;
		public long BytesIn => _net.Statistics.BytesReceived;
		public long BytesOut => _net.Statistics.BytesSent;

		// Server clock estimate used by the game for timing. Synced from the first/each event.
		public int ServerTimeInMilliSeconds => Environment.TickCount + _serverTimeOffsetMs;

		public bool Connect(string serverAddress, string applicationName) {
			ServerAddress = serverAddress;
			if (!ParseEndpoint(serverAddress, out var host, out var port)) {
				_listener.DebugReturn(DebugLevel.ERROR, "Bad server address: " + serverAddress);
				return false;
			}

			if (!_net.IsRunning && !_net.Start()) {
				_listener.DebugReturn(DebugLevel.ERROR, "Failed to start client socket.");
				return false;
			}

			_state = PeerStateValue.Connecting;

			// appId (application version) rides the connect payload -> InitRequest.ApplicationId.
			var writer = new NetDataWriter();
			writer.Put(applicationName ?? string.Empty);
			_server = _net.Connect(host, port, writer);
			return _server != null;
		}

		public void Disconnect() {
			if (_server != null) { _net.DisconnectPeer(_server); _server = null; }
			_state = PeerStateValue.Disconnected;
			_net.Stop();
		}

		// Pumps the transport; UberStrike calls this each frame.
		public void Service() => _net.PollEvents();

		public bool SendOutgoingCommands() { _net.PollEvents(); return true; }

		public bool SendAcksOnly() { /* LiteNetLib auto-acks */ return true; }

		public bool DispatchIncomingCommands() { _net.PollEvents(); return true; }

		// Photon uses this to (re)sync the server clock. LiteNetLib already tracks RTT and
		// keeps time via its own ping; we refresh our offset estimate from the live ping so
		// ServerTimeInMilliSeconds stays sensible. Safe to call any time.
		public void FetchServerTimestamp() {
			if (_server != null && _server.ConnectionState == ConnectionState.Connected) {
				// Bias the local clock by the one-way latency so client/server timestamps line up.
				_serverTimeOffsetMs = -(_server.Ping);
			}
		}

		// The UberStrike RemoteProcedureCall delegate target.
		public bool OpCustom(byte customOpCode, Dictionary<byte, object> customOpParameters, bool sendReliable, byte channelId, bool encrypt) {
			if (_server == null || _server.ConnectionState != ConnectionState.Connected) {
				_listener.DebugReturn(DebugLevel.WARNING, $"[LNL] op {customOpCode} dropped: not connected (state {_server?.ConnectionState})");
				return false;
			}
			var wire = WireMessage.Operation(customOpCode, customOpParameters);
			byte[] bytes = WireCodec.Encode(wire);
			try {
				_server.Send(bytes, sendReliable ? (byte)0 : (byte)1, sendReliable ? DeliveryMethod.ReliableOrdered : DeliveryMethod.Sequenced);
				_listener.DebugReturn(DebugLevel.INFO, $"[LNL] -> op {customOpCode} ({bytes.Length}b, {(sendReliable ? "rel" : "unrel")})");
				return true;
			} catch (Exception ex) {
				_listener.DebugReturn(DebugLevel.ERROR, "[LNL] send failed: " + ex.Message);
				_listener.OnStatusChanged(StatusCode.SendError);
				return false;
			}
		}

		public bool OpCustom(byte customOpCode, Dictionary<byte, object> customOpParameters, bool sendReliable)
			=> OpCustom(customOpCode, customOpParameters, sendReliable, 0, false);

		public bool OpCustom(byte customOpCode, Dictionary<byte, object> customOpParameters, bool sendReliable, byte channelId)
			=> OpCustom(customOpCode, customOpParameters, sendReliable, channelId, false);

		// ---- INetEventListener ----------------------------------------------------

		public void OnPeerConnected(NetPeer peer) {
			_server = peer;
			_state = PeerStateValue.Connected;
			_listener.DebugReturn(DebugLevel.INFO, "[LNL] connected to " + ServerAddress);
			_listener.OnStatusChanged(StatusCode.Connect);
		}

		public void OnPeerDisconnected(NetPeer peer, DisconnectInfo disconnectInfo) {
			_state = PeerStateValue.Disconnected;
			_server = null;
			_listener.OnStatusChanged(MapStatus(disconnectInfo.Reason));
		}

		public void OnNetworkReceive(NetPeer peer, NetPacketReader reader, DeliveryMethod deliveryMethod) {
			byte[] data = reader.GetRemainingBytes();
			WireMessage msg;
			try { msg = WireCodec.Decode(data); }
			catch (Exception ex) { _listener.DebugReturn(DebugLevel.ERROR, "bad wire message: " + ex.Message); return; }

			_listener.DebugReturn(DebugLevel.INFO, $"[LNL] <- {msg.Type} code {msg.Code} ({data.Length}b)");

			switch (msg.Type) {
				case WireMessageType.Event:
					_listener.OnEvent(new EventData { Code = msg.Code, Parameters = msg.Parameters });
					break;
				case WireMessageType.OperationResponse:
					_listener.OnOperationResponse(new OperationResponse {
						OperationCode = msg.Code,
						ReturnCode = msg.ReturnCode,
						DebugMessage = msg.DebugMessage,
						Parameters = msg.Parameters,
					});
					break;
			}
		}

		public void OnConnectionRequest(ConnectionRequest request) => request.Reject();   // client never accepts
		public void OnNetworkError(IPEndPoint endPoint, SocketError socketError) {
			_listener.OnStatusChanged(StatusCode.Exception);
		}
		public void OnNetworkReceiveUnconnected(IPEndPoint remoteEndPoint, NetPacketReader reader, UnconnectedMessageType messageType) { }
		public void OnNetworkLatencyUpdate(NetPeer peer, int latency) { }

		// ---- helpers --------------------------------------------------------------

		private static StatusCode MapStatus(DisconnectReason reason) {
			switch (reason) {
				case DisconnectReason.Timeout:
				case DisconnectReason.ConnectionFailed:
					return StatusCode.TimeoutDisconnect;
				case DisconnectReason.ConnectionRejected:
					return StatusCode.DisconnectByServerLogic;
				case DisconnectReason.RemoteConnectionClose:
					return StatusCode.DisconnectByServer;
				default:
					return StatusCode.Disconnect;
			}
		}

		private static bool ParseEndpoint(string address, out string host, out int port) {
			host = null; port = 0;
			if (string.IsNullOrEmpty(address)) return false;
			// Accept "host:port", "host", or "udp://host:port".
			address = address.Replace("udp://", string.Empty).Trim();
			int colon = address.LastIndexOf(':');
			if (colon < 0) { host = address; port = 5055; return true; }
			host = address.Substring(0, colon);
			return int.TryParse(address.Substring(colon + 1), out port);
		}
	}
}
