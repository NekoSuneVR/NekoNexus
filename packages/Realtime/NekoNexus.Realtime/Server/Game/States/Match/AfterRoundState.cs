using Cmune.DataCenter.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using UberStrike.Core.Models;

namespace NekoNexus.Realtime.Server.Game {
	internal class AfterRoundState : BaseMatchState {
		public AfterRoundState(BaseGameRoom room) : base(room) { }

		public override void OnEnter() {
			// MVP calc indexes an achievements dictionary - a missing key would throw and crash
			// the whole match-end (the "game crashes when someone wins" bug). Guard it.
			List<StatsSummary> mvps;
			try {
				mvps = Room.StatisticsManager.GetMostValuablePlayers();
			} catch (Exception ex) {
				Log.Error("Failed to compute most-valuable-players", ex);
				mvps = new List<StatsSummary>();
			}

			var timeInGameSeconds = Room.RoundDurations.Count > 0
				? (int)Room.RoundDurations.Aggregate((sum, duration) => sum.Add(duration)).TotalSeconds
				: 0;

			var matchData = new EndOfMatchData() {
				MostValuablePlayers = mvps,
				MatchGuid = Room.MetaData.Guid,
				TimeInGameMinutes = timeInGameSeconds
			};

			GameServerApplication.Instance.SocketClient?.SendSync(WebSocket.PacketType.RoundEnded, new object[] { Room.MetaData, matchData });

			var r = new Random((int)DateTime.UtcNow.Ticks);

			foreach (var player in Room.Players) {
				// Guard the whole per-player block: a stats / serialization / persistence error for
				// ONE player must not abort match-end for the rest of the room.
				try {
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

					// Persist progression (points + stats/XP) OFF the loop thread. DepositPoints and
					// SaveStatistics are SYNCHRONOUS web-service round-trips; running them inline (once
					// per player) blocked the shared scheduler thread for the whole call, freezing every
					// other room it drives ("ghost walking"). Capture everything we need first, then
					// fire-and-forget. The match-end screen is sent immediately below, regardless.
					var capturedPlayer = player;
					var capturedData = playerMatchData;
					var authToken = player.AuthToken;
					var cmid = player.Actor.Cmid;
					var pointDepositId = r.Next(1, int.MaxValue);
					System.Threading.Tasks.Task.Run(() => {
						try {
							UserWebServiceClient.Instance.DepositPoints(new PointDepositView {
								Cmid = cmid,
								DepositDate = DateTime.UtcNow,
								DepositType = PointsDepositType.Game,
								PointDepositId = pointDepositId,
								Points = capturedData.PlayerStatsTotal.Points,
							}, authToken);

							Room.StatisticsManager.SaveStatistics(capturedPlayer, capturedData);
						} catch (Exception ex) {
							Log.Error($"Failed to persist match results for cmid {cmid}", ex);
						}
					});

					player.GameEventSender.SendMatchEnd(playerMatchData);
					player.State.SetState(PlayerStateId.Overview);
				} catch (Exception ex) {
					Log.Error($"Error finalising match for cmid {player.Actor.Cmid}", ex);
				}
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
