using log4net;
using Photon.SocketServer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using static Paradise.WebSocket;

namespace Paradise.Realtime.Server.Comm {
	public class CommServerApplication : BaseRealtimeApplication {
		protected static readonly new ILog Log = LogManager.GetLogger(nameof(CommServerApplication));

		public static new CommServerApplication Instance => (CommServerApplication)ApplicationBase.Instance;
		public override ServerType ServerType => ServerType.Comm;

		protected System.Timers.Timer MonitoringTimer;

		public override int Peers {
			get {
				return LobbyManager.Instance.Peers.Count;
			}
		}

		protected override PeerBase OnCreatePeer(InitRequest initRequest) {
			return new CommPeer(initRequest);
		}

		protected override void OnBeforeSetup() {
			if (Configuration.CommApplicationSettings.ApplicationIdentifier == null) {
				Log.Fatal("ApplicationIdentifier is null!");
				throw new ArgumentNullException(nameof(Configuration.CommApplicationSettings.ApplicationIdentifier));
			}

			Identifier = Configuration.CommApplicationSettings.ApplicationIdentifier;

			if (Configuration.CommApplicationSettings.PhotonId == 0) {
				Log.Fatal("PhotonId is null!");
				throw new ArgumentNullException(nameof(Configuration.CommApplicationSettings.PhotonId));
			}

			PhotonId = Configuration.CommApplicationSettings.PhotonId;

			Log.Info($"Starting CommServer[{Identifier}]...");
		}

		protected override void OnSetup() {
			MonitoringTimer = new System.Timers.Timer(TimeSpan.FromSeconds(5).TotalMilliseconds);
			MonitoringTimer.Elapsed += delegate {
				PublishMonitoringData();
			};

			SocketClient = new SocketClient(Identifier, ServerType.Comm, PhotonId, Configuration.CommApplicationSettings.EncryptionPassPhrase);

			SocketClient.Connected += (sender, e) => {
				Log.Info("Comm: CONNECTED TO SOCKET");

				PublishMonitoringData();
				MonitoringTimer.Start();
			};

			SocketClient.Disconnected += (sender, e) => {
				Log.Info("Comm: DISCONNECTED FROM SOCKET");

				MonitoringTimer.Stop();
				SocketClient.Reconnect(25);
			};

			SocketClient.ConnectionRejected += (sender, e) => {
				Log.Info($"Comm: Rejected connection by socket server (Reason: {e.Reason})");
			};

			SocketClient.DataReceived += (sender, e) => {
				switch (e.Type) {
					case PacketType.ChatMessage:
						var message = (SocketChatMessage)e.Data;

						foreach (var peer in LobbyManager.Instance.Peers) {
							peer.LobbyEventSender.SendLobbyChatMessage(message.Cmid, message.Name, message.Message);
						}
						break;
					case PacketType.BanPlayer: {
						var data = (Dictionary<string, object>)e.Data;
						var targetPeer = LobbyManager.Instance.Peers.FirstOrDefault(_ => _.Actor.Cmid == (long)data["TargetCmid"]);

						if (targetPeer != null) {
							if ((long)data["Duration"] == 0) {
								targetPeer.SendError($"You have been banned permanently.\n\nReason: {data["Reason"]}");
							} else {
								var expireTime = ((DateTime)data["ExpireTime"]).ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss \"GMT\"zzz");
								targetPeer.SendError($"You have been banned for {data["Duration"]} minute(s).\nYour ban will expire at {expireTime}\n\nReason: {data["Reason"]}");
							}
						}

						break;
					}
				}
			};

			var tcpAddress = Dns.GetHostAddresses(Configuration.MasterHostname).Where(_ => _.AddressFamily == AddressFamily.InterNetwork).First();

			if (tcpAddress != null) {
				SocketClient.Connect(tcpAddress, Configuration.SocketPort);
			}

			Log.Info($"Started CommServer[{Identifier}].");
		}

		protected override void OnBeforeTearDown() {
			Log.Info($"Stopping CommServer[{Identifier}]...");

			MonitoringTimer?.Stop();
		}

		protected override void OnTearDown() {
			Log.Info($"Stopped CommServer[{Identifier}].");
		}

		private void PublishMonitoringData() {
			SocketClient?.Send(PacketType.Monitoring, GetStatus());
		}

		private Dictionary<string, object> GetStatus() {
			try {
				return new Dictionary<string, object> {
					["peers"] = LobbyManager.Instance.Peers.Select(peer => peer.Actor.ActorInfo),
					["updated_at"] = DateTime.UtcNow.ToString("o")
				};
			} catch (Exception e) {
				Log.Error(e);

				return new Dictionary<string, object> { ["error"] = e.Message };
			}
		}
	}
}
