using System;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using LiteNetLib;
using Paradise.Transport;
using PhotonReason = PhotonHostRuntimeInterfaces.DisconnectReason;

namespace Photon.SocketServer {
	public sealed class RealtimeHostOptions {
		public int Port = 5055;
		// User-defined concurrent-player cap. No license, no CCU paywall: set what you want.
		public int MaxPeers = 1000;
		// Optional connection gate; client must present the same key. Empty = accept any.
		public string ConnectionKey = "Paradise";
		public string BinaryPath;
		public string ApplicationPath;
		public int PollIntervalMs = 10;
		public int DisconnectTimeoutMs = 10000;
	}

	// Replaces PhotonSocketServer.exe for a single application instance: binds one UDP
	// listener and pumps the LiteNetLib event loop, translating transport events into the
	// Photon.SocketServer peer callbacks Paradise.Realtime already implements.
	public sealed class RealtimeHost : INetEventListener {
		private readonly ApplicationBase _app;
		private readonly RealtimeHostOptions _opts;
		private readonly NetManager _net;
		private readonly ConcurrentDictionary<int, PeerBase> _peers = new ConcurrentDictionary<int, PeerBase>();
		private readonly ConcurrentDictionary<int, string> _pendingAppId = new ConcurrentDictionary<int, string>();
		private volatile bool _running;

		public int PeerCount => _peers.Count;
		public int Port => _opts.Port;

		public RealtimeHost(ApplicationBase app, RealtimeHostOptions opts) {
			_app = app;
			_opts = opts;
			_net = new NetManager(this) {
				AutoRecycle = true,
				DisconnectTimeout = opts.DisconnectTimeoutMs,
				UpdateTime = Math.Max(1, opts.PollIntervalMs),
				ChannelsCount = 4,
			};
		}

		public void RunBlocking() {
			if (!_net.Start(_opts.Port))
				throw new InvalidOperationException($"Failed to bind UDP port {_opts.Port}.");

			_running = true;
			while (_running) {
				_net.PollEvents();
				Thread.Sleep(_opts.PollIntervalMs);
			}
			_net.Stop();
		}

		public void Stop() => _running = false;

		internal static bool TraceEnabled =
			System.Environment.GetEnvironmentVariable("PARADISE_TRACE") == "1";
		private static void Trace(string m) { if (TraceEnabled) System.Console.WriteLine("[net] " + m); }

		internal SendResult Send(PeerBase peer, byte[] data, bool unreliable, byte channel) {
			var np = peer.Transport;
			if (np == null || np.ConnectionState != ConnectionState.Connected) return SendResult.Disconnected;
			try {
				// Keep delivery-method-per-channel consistent: reliable -> ch0, unreliable -> ch1.
				// (LiteNetLib binds a channel slot to one method on first use.) The client mirrors this.
				np.Send(data, unreliable ? (byte)1 : (byte)0, unreliable ? DeliveryMethod.Sequenced : DeliveryMethod.ReliableOrdered);
				Trace($"TX {data.Length}b -> peer {np.Id} ({(unreliable ? "unrel" : "rel")})");
				return SendResult.Ok;
			} catch (Exception ex) {
				Trace("TX failed: " + ex.Message);
				return SendResult.Failed;
			}
		}

		internal void Disconnect(PeerBase peer) {
			var np = peer.Transport;
			if (np != null) _net.DisconnectPeer(np);
		}

		// ---- INetEventListener ----------------------------------------------------

		public void OnConnectionRequest(ConnectionRequest request) {
			if (_peers.Count >= _opts.MaxPeers) {
				request.Reject();
				return;
			}

			string appId = string.Empty;
			try {
				if (request.Data != null && request.Data.AvailableBytes > 0)
					appId = request.Data.GetString();
			} catch { /* malformed connect payload -> treat as empty app id */ }

			var np = request.Accept();
			if (np != null) _pendingAppId[np.Id] = appId;
			Trace($"connection request appId='{appId}' -> {(np != null ? "accepted peer " + np.Id : "rejected")}");
		}

		public void OnPeerConnected(NetPeer peer) {
			_pendingAppId.TryRemove(peer.Id, out var appId);

			var ep = peer.EndPoint;
			var init = new InitRequest {
				ApplicationId = appId,
				RemoteIP = ep.Address.ToString(),
				RemotePort = ep.Port,
				RemoteIPAddress = ep.Address,
				LocalIPAddress = IPAddress.Any,
				LocalPort = _opts.Port,
			};

			PeerBase cp;
			try {
				cp = _app.CreatePeerInternal(init);
			} catch (Exception ex) {
				NetDebug.WriteError("[RealtimeHost] CreatePeer failed: " + ex);
				_net.DisconnectPeer(peer);
				return;
			}

			if (cp == null) { _net.DisconnectPeer(peer); return; }

			cp.Transport = peer;
			cp.Host = this;
			cp.RemoteIP = init.RemoteIP;
			cp.RemotePort = init.RemotePort;
			cp.RemoteIPAddress = init.RemoteIPAddress;
			cp.LocalIPAddress = init.LocalIPAddress;
			cp.LocalPort = init.LocalPort;

			_peers[peer.Id] = cp;

			// A peer can ask to disconnect from inside its own constructor (e.g. unsupported app id).
			if (cp.DisconnectRequested) _net.DisconnectPeer(peer);
		}

		public void OnNetworkReceive(NetPeer peer, NetPacketReader reader, DeliveryMethod deliveryMethod) {
			if (!_peers.TryGetValue(peer.Id, out var cp)) return;

			byte[] data = reader.GetRemainingBytes();
			WireMessage msg;
			try {
				msg = WireCodec.Decode(data);
			} catch (Exception ex) {
				NetDebug.WriteError("[RealtimeHost] bad wire message: " + ex.Message);
				return;
			}

			Trace($"RX {data.Length}b from peer {peer.Id} -> {msg.Type} code {msg.Code} ({msg.Parameters.Count} params)");

			if (msg.Type != WireMessageType.Operation) return;   // client only sends operations

			var request = new OperationRequest(msg.Code, msg.Parameters);
			var sp = new SendParameters { Unreliable = deliveryMethod != DeliveryMethod.ReliableOrdered };

			try {
				cp.DispatchOperationRequest(request, sp);
			} catch (Exception ex) {
				NetDebug.WriteError("[RealtimeHost] operation handler threw: " + ex);
			}
		}

		public void OnPeerDisconnected(NetPeer peer, DisconnectInfo disconnectInfo) {
			_pendingAppId.TryRemove(peer.Id, out _);
			if (_peers.TryRemove(peer.Id, out var cp)) {
				try {
					cp.DispatchDisconnect(MapReason(disconnectInfo.Reason), disconnectInfo.Reason.ToString());
				} catch (Exception ex) {
					NetDebug.WriteError("[RealtimeHost] disconnect handler threw: " + ex);
				}
			}
		}

		public void OnNetworkError(IPEndPoint endPoint, SocketError socketError) { }
		public void OnNetworkReceiveUnconnected(IPEndPoint remoteEndPoint, NetPacketReader reader, UnconnectedMessageType messageType) { }
		public void OnNetworkLatencyUpdate(NetPeer peer, int latency) { }

		private static PhotonReason MapReason(LiteNetLib.DisconnectReason reason) {
			switch (reason) {
				case LiteNetLib.DisconnectReason.Timeout:
				case LiteNetLib.DisconnectReason.ConnectionFailed:
					return PhotonReason.TimeoutDisconnect;
				case LiteNetLib.DisconnectReason.DisconnectPeerCalled:
					return PhotonReason.ServerDisconnect;
				case LiteNetLib.DisconnectReason.RemoteConnectionClose:
					return PhotonReason.ClientDisconnect;
				default:
					return PhotonReason.ManagedDisconnect;
			}
		}
	}
}
