using Cmune.DataCenter.Common.Entities;
using System;
using System.Linq;
using UberStrike.Core.Models;

namespace Paradise.Realtime.Server.Game {
	internal class AfterRoundState : BaseMatchState {
		public AfterRoundState(BaseGameRoom room) : base(room) {
			
		}

		public override void OnEnter() {
			var matchData = new EndOfMatchData() {
				MostValuablePlayers = Room.StatisticsManager.GetMostValuablePlayers(),
				MatchGuid = Room.MetaData.Guid,
				TimeInGameMinutes = (int)Room.RoundDurations.Aggregate((sum, duration) => sum.Add(duration)).TotalSeconds
			};

			GameServerApplication.Instance.SocketClient?.SendSync(WebSocket.PacketType.RoundEnded, new object[] { Room.MetaData, matchData });

			foreach (var player in Room.Players) {
				Room.StatisticsManager.ResetCurrentLifeStatistics(player);

				var playerMatchData = new EndOfMatchData {
					PlayerStatsTotal = Room.StatisticsManager.GetMatchStatistics(player),
					PlayerStatsBestPerLife = Room.StatisticsManager.GetBestPerLifeStatistics(player),
					MostEffecientWeaponId = 0,
					PlayerXpEarned = null,
					MostValuablePlayers = matchData.MostValuablePlayers,
					MatchGuid = matchData.MatchGuid,
					HasWonMatch = Room.IsTeamGame ? player.Actor.Team == Room.WinningTeam : player.Actor.Cmid == Room.WinningCmid,
					TimeInGameMinutes = matchData.TimeInGameMinutes
				};

				Room.StatisticsManager.CalculateXp(matchData);
				Room.StatisticsManager.CalculatePoints(matchData);

				UserWebServiceClient.Instance.DepositPoints(new PointDepositView {
					Cmid = player.Actor.Cmid,
					DepositDate = DateTime.UtcNow,
					DepositType = PointsDepositType.Game,
					PointDepositId = new Random((int)DateTime.UtcNow.Ticks).Next(1, int.MaxValue),
					Points = matchData.PlayerStatsTotal.Points,
				}, player.AuthToken);

				Room.StatisticsManager.SaveStatistics(player, matchData);

				player.GameEventSender.SendMatchEnd(matchData);
				player.State.SetState(PlayerStateId.Overview);
			}

			foreach (var peer in Room.Peers) {
				foreach (var player in Room.Players) {
					if (player.Actor.Cmid.CompareTo(peer.Actor.Cmid) == 0) continue;

					player.GameEventSender.SendPlayerLeftGame(peer.Actor.Cmid);
				}
			}

			Room.Reset();
		}

		public override void OnExit() {
		}

		public override void OnResume() {
		}

		public override void OnUpdate() {
		}
	}
}
