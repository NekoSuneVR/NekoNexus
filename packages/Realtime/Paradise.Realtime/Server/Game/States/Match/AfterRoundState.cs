using Cmune.DataCenter.Common.Entities;
using System;
using System.Linq;
using UberStrike.Core.Models;

namespace Paradise.Realtime.Server.Game {
	internal class AfterRoundState : BaseMatchState {
		public AfterRoundState(BaseGameRoom room) : base(room) { }

		public override void OnEnter() {
			var matchData = new EndOfMatchData() {
				MostValuablePlayers = Room.StatisticsManager.GetMostValuablePlayers(),
				MatchGuid = Room.MetaData.Guid,
				TimeInGameMinutes = (int)Room.RoundDurations.Aggregate((sum, duration) => sum.Add(duration)).TotalSeconds
			};

			GameServerApplication.Instance.SocketClient?.SendSync(WebSocket.PacketType.RoundEnded, new object[] { Room.MetaData, matchData });

			var r = new Random((int)DateTime.UtcNow.Ticks);

			foreach (var player in Room.Players) {
				Room.StatisticsManager.ResetCurrentLifeStatistics(player);

				var playerMatchData = new EndOfMatchData {
					PlayerStatsTotal = Room.StatisticsManager.GetMatchStatistics(player),
					PlayerStatsBestPerLife = Room.StatisticsManager.GetBestPerLifeStatistics(player),
					MostEffecientWeaponId = 0,
					MostValuablePlayers = matchData.MostValuablePlayers,
					MatchGuid = matchData.MatchGuid,
					HasWonMatch = Room.IsTeamGame ? player.Actor.Team == Room.WinningTeam : player.Actor.Cmid == Room.WinningCmid,
					TimeInGameMinutes = matchData.TimeInGameMinutes
				};

				Room.StatisticsManager.CalculateXp(playerMatchData);
				Room.StatisticsManager.CalculatePoints(playerMatchData);

				// Persist progression: deposit the match Points and save the accumulated stats /
				// XP / level to the web service. Wrapped per-player so one failure (network,
				// serialization) can't abort match-end for the rest of the room.
				try {
					UserWebServiceClient.Instance.DepositPoints(new PointDepositView {
						Cmid = player.Actor.Cmid,
						DepositDate = DateTime.UtcNow,
						DepositType = PointsDepositType.Game,
						PointDepositId = r.Next(1, int.MaxValue),
						Points = playerMatchData.PlayerStatsTotal.Points,
					}, player.AuthToken);

					Room.StatisticsManager.SaveStatistics(player, playerMatchData);
				} catch (Exception ex) {
					Log.Error($"Failed to persist match results for cmid {player.Actor.Cmid}", ex);
				}

				player.GameEventSender.SendMatchEnd(playerMatchData);
				player.State.SetState(PlayerStateId.Overview);
			}

			foreach (var peer in Room.Peers) {
				foreach (var player in Room.Players) {
					if (player.Actor.Cmid.CompareTo(peer.Actor.Cmid) == 0)
						continue;

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
