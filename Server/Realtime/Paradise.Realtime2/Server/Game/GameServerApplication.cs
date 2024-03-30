using log4net;
using Photon.SocketServer;
using System;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using static Paradise.WebSocket;

namespace Paradise.Realtime.Server.Game {
	public class GameServerApplication : BaseRealtimeApplication {
		protected static readonly new ILog Log = LogManager.GetLogger(nameof(GameServerApplication));

		public static new GameServerApplication Instance => (GameServerApplication)ApplicationBase.Instance;
		public override ServerType ServerType => ServerType.Game;
		public GameRoomManager RoomManager { get; private set; } = new GameRoomManager();

		protected System.Timers.Timer MonitoringTimer;

		public override int Peers {
			get {
				var count = 0;
				foreach (var room in RoomManager.Rooms.Values) {
					count += room.Peers.Count;
				}
				return count;
			}
		}

		//public int Players {
		//	get {
		//		var count = 0;
		//		foreach (var room in RoomManager.Rooms.Values) {
		//			count += room.Players.Count;
		//		}
		//		return count;
		//	}
		//}

		protected override PeerBase OnCreatePeer(InitRequest initRequest) {
			return new GamePeer(initRequest);
		}

		protected override void OnBeforeSetup() {
			if (Configuration.GameApplicationSettings.ApplicationIdentifier == null) {
				Log.Fatal("ApplicationIdentifier is null!");
				throw new ArgumentNullException(nameof(Configuration.GameApplicationSettings.ApplicationIdentifier));
			}

			Identifier = Configuration.GameApplicationSettings.ApplicationIdentifier;

			if (Configuration.GameApplicationSettings.PhotonId == 0) {
				Log.Fatal("PhotonId is null!");
				throw new ArgumentNullException(nameof(Configuration.GameApplicationSettings.PhotonId));
			}

			PhotonId = Configuration.GameApplicationSettings.PhotonId;

			Log.Info($"Starting GameServer[{Identifier}]...");
		}

		protected override void OnSetup() {
			MonitoringTimer = new System.Timers.Timer(TimeSpan.FromSeconds(5).TotalMilliseconds);
			MonitoringTimer.Elapsed += delegate {
				//PublishMonitoringData();
			};

			SocketClient = new SocketClient(Identifier, ServerType.Game, PhotonId, Configuration.GameApplicationSettings.EncryptionPassPhrase);

			SocketClient.Connected += (sender, e) => {
				Log.Info("Game: CONNECTED TO SOCKET");

				//PublishMonitoringData();
				MonitoringTimer.Start();
			};

			SocketClient.Disconnected += (sender, e) => {
				Log.Info("Game: DISCONNECTED FROM SOCKET");

				MonitoringTimer.Stop();
				SocketClient.Reconnect(25);
			};

			SocketClient.ConnectionRejected += (sender, e) => {
				Log.Info($"Game: Rejected connection by socket server (Reason: {e.Reason})");
			};

			SocketClient.DataReceived += (sender, e) => { };

			var tcpAddress = Dns.GetHostAddresses(Configuration.MasterHostname).Where(_ => _.AddressFamily == AddressFamily.InterNetwork).First();

			if (tcpAddress != null) {
				SocketClient.Connect(tcpAddress, Configuration.SocketPort);
			}

			Log.Info($"Started GameServer[{Identifier}].");
		}

		protected override void OnBeforeTearDown() {
			Log.Info($"Stopping GameServer[{Identifier}]...");

			MonitoringTimer?.Stop();
		}

		protected override void OnTearDown() {
			Log.Info($"Stopped GameServer[{Identifier}].");
		}
	}
}
