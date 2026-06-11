using NekoNexus.Realtime.Core;
using System.Linq;
using UberStrike.Core.Models;

namespace NekoNexus.Realtime.Server.Game {
	internal class DeathMatchRoom : BaseGameRoom {
		public DeathMatchRoom(GameRoomData metaData, ILoopScheduler scheduler) : base(metaData, scheduler) { }

		public override bool CanJoinMatch => true;
		public override bool CanStartMatch => Players.Count > 1;

		public override void GetCurrentScore(out short killsRemaining, out short blueTeamScore, out short redTeamScore) {
			var leader = Players.OrderByDescending(_ => _.Actor.ActorInfo.Kills).First();

			killsRemaining = (short)(MetaData.KillLimit - leader.Actor.ActorInfo.Kills);
			blueTeamScore = 0;
			redTeamScore = 0;
		}

		protected override void OnPlayerKilled(PlayerKilledEventArgs args) {
			base.OnPlayerKilled(args);

			var leader = Players.OrderByDescending(_ => _.Actor.ActorInfo.Kills).First();
			if (leader.Actor.ActorInfo.Kills >= MetaData.KillLimit) {
				WinningCmid = leader.Actor.Cmid;

				HasRoundEnded = true;
			}
		}

		protected override void SwitchTeam(GamePeer peer) {
			return;
		}
	}
}
