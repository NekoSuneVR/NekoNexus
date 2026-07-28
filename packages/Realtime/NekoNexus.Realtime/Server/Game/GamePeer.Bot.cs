using Cmune.DataCenter.Common.Entities;
using Photon.SocketServer;
using System;
using System.Collections.Generic;
using UberStrike.Core.ViewModel;
using UberStrike.DataCenter.Common.Entities;
using UberStrike.Realtime.UnitySdk;

namespace NekoNexus.Realtime.Server.Game {
	// AI fill bot support. A bot is a real GamePeer - it flows through the exact same room
	// join/spawn/damage/statistics code real players do - just constructed with no live network
	// connection (InitRequest carries no socket, so every SendEvent/SendOperationResponse is a
	// safe no-op) and with synthetic Member/AuthToken data instead of an authenticated session.
	public partial class GamePeer {
		public bool IsBot { get; private set; }

		private static int nextBotCmid;

		public static GamePeer CreateBot(string name, int xp) {
			var initRequest = new InitRequest(ApiVersion.Current, new PeerConfiguration(
				heartbeatInterval: 30,
				heartbeatTimeout: 30,
				compositeHashes: new List<byte[]>(),
				junkHashes: new List<byte[]>()
			) { EnableHashVerification = false });

			var bot = new GamePeer(initRequest) {
				IsBot = true,
				AuthToken = $"bot:{Guid.NewGuid():N}",
			};

			var cmid = System.Threading.Interlocked.Decrement(ref nextBotCmid);

			bot.Member = new UberstrikeUserViewModel {
				CmuneMemberView = new MemberView {
					PublicProfile = new PublicProfileView {
						Cmid = cmid,
						Name = name,
						AccessLevel = MemberAccessLevel.Default,
						GroupTag = string.Empty,
					}
				},
				UberstrikeMemberView = new UberstrikeMemberView {
					PlayerStatisticsView = new PlayerStatisticsView { Cmid = cmid, Xp = xp }
				}
			};

			return bot;
		}
	}
}
