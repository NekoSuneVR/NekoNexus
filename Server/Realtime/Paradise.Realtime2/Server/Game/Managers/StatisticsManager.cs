using Photon.SocketServer.Rpc;
using System;
using System.Collections.Generic;
using System.Linq;
using UberStrike.Core.Models;
using UberStrike.Core.Models.Views;
using UberStrike.Core.Types;

namespace Paradise.Realtime.Server.Game {
	public class StatisticsManager {
		private BaseGameRoom room;
		private ApplicationConfigurationView ApplicationConfiguration => XpPointsUtil.Config;

		public Dictionary<int, GameActorStatistics> Statistics { get; private set; } = new Dictionary<int, GameActorStatistics>();

		public StatisticsManager(BaseGameRoom room) {
			this.room = room;
		}

		public void Add(GamePeer peer) {
			if (!Statistics.ContainsKey(peer.Actor.Cmid)) {
				Statistics.Add(peer.Actor.Cmid, new GameActorStatistics(peer));
			}
		}

		public void Clear() {
			Statistics.Clear();
		}

		public void ResetStatistics(GamePeer player) {
			if (Statistics.ContainsKey(player.Actor.Cmid)) {
				Statistics[player.Actor.Cmid]?.ResetStatistics();
			}
		}

		public void ResetCurrentLifeStatistics(GamePeer player, bool addToPerLifeStatistics = true) {
			Statistics[player.Actor.Cmid]?.ResetCurrentLifeStatistics(addToPerLifeStatistics);
		}

		public void CalculateXp(EndOfMatchData data) {
			if (data.PlayerStatsTotal.GetDamageDealt() > 0) {
				int gainedXp = (!data.HasWonMatch) ? ApplicationConfiguration.XpBaseLoser : ApplicationConfiguration.XpBaseWinner;
				gainedXp += Math.Max(0, data.PlayerStatsTotal.GetKills()) * ApplicationConfiguration.XpKill;
				gainedXp += Math.Max(0, data.PlayerStatsTotal.Nutshots) * ApplicationConfiguration.XpNutshot;
				gainedXp += Math.Max(0, data.PlayerStatsTotal.Headshots) * ApplicationConfiguration.XpHeadshot;
				gainedXp += Math.Max(0, data.PlayerStatsTotal.MeleeKills) * ApplicationConfiguration.XpSmackdown;

				int xpPerMinute = (!data.HasWonMatch) ? ApplicationConfiguration.XpPerMinuteLoser : ApplicationConfiguration.XpPerMinuteWinner;
				gainedXp += (int)Math.Ceiling((float)(data.TimeInGameMinutes / 60 * xpPerMinute));
				gainedXp += ((int)Math.Ceiling((float)(data.TimeInGameMinutes / 60 * xpPerMinute)) * 0 /* CalculateBoost */);

				data.PlayerStatsTotal.Xp = gainedXp;
			}
		}

		public void CalculatePoints(EndOfMatchData data) {
			if (data.PlayerStatsTotal.GetDamageDealt() > 0) {
				int gainedPoints = (!data.HasWonMatch) ? ApplicationConfiguration.PointsBaseLoser : ApplicationConfiguration.PointsBaseWinner;
				gainedPoints += Math.Max(0, data.PlayerStatsTotal.GetKills()) * ApplicationConfiguration.PointsKill;
				gainedPoints += Math.Max(0, data.PlayerStatsTotal.Nutshots) * ApplicationConfiguration.PointsNutshot;
				gainedPoints += Math.Max(0, data.PlayerStatsTotal.Headshots) * ApplicationConfiguration.PointsHeadshot;
				gainedPoints += Math.Max(0, data.PlayerStatsTotal.MeleeKills) * ApplicationConfiguration.PointsSmackdown;

				int pointsPerMinute = (!data.HasWonMatch) ? ApplicationConfiguration.PointsPerMinuteLoser : ApplicationConfiguration.PointsPerMinuteWinner;
				gainedPoints += (int)Math.Ceiling((float)(data.TimeInGameMinutes / 60 * pointsPerMinute));
				gainedPoints += ((int)Math.Ceiling((float)(data.TimeInGameMinutes / 60 * pointsPerMinute)) * 0 /* CalculateBoost */);

				data.PlayerStatsTotal.Points = gainedPoints;
			}
		}

		public void SaveStatistics(GamePeer player, EndOfMatchData matchData) {
			var bestPerLifeStatistics = matchData.PlayerStatsBestPerLife;
			var totalStatistics = matchData.PlayerStatsTotal;

			var statistics = player.Member.UberstrikeMemberView.PlayerStatisticsView;

			statistics.Hits += totalStatistics.GetHits();
			statistics.Shots += totalStatistics.GetShots();
			statistics.Splats += totalStatistics.GetKills();
			statistics.Splatted += totalStatistics.Deaths;
			statistics.Headshots += totalStatistics.Headshots;
			statistics.Nutshots += totalStatistics.Nutshots;
			statistics.Xp += totalStatistics.Xp;
			statistics.TimeSpentInGame += matchData.TimeInGameMinutes;
			statistics.Level = XpPointsUtil.GetLevelForXp(statistics.Xp);

			// Machine Gun
			statistics.WeaponStatistics.MachineGunTotalDamageDone += matchData.PlayerStatsTotal.MachineGunDamageDone;
			statistics.WeaponStatistics.MachineGunTotalSplats += matchData.PlayerStatsTotal.MachineGunKills;
			statistics.WeaponStatistics.MachineGunTotalShotsFired += matchData.PlayerStatsTotal.MachineGunShotsFired;
			statistics.WeaponStatistics.MachineGunTotalShotsHit += matchData.PlayerStatsTotal.MachineGunShotsHit;

			// Shotgun
			statistics.WeaponStatistics.ShotgunTotalDamageDone += matchData.PlayerStatsTotal.ShotgunDamageDone;
			statistics.WeaponStatistics.ShotgunTotalSplats += matchData.PlayerStatsTotal.ShotgunSplats;
			statistics.WeaponStatistics.ShotgunTotalShotsFired += matchData.PlayerStatsTotal.ShotgunShotsFired;
			statistics.WeaponStatistics.ShotgunTotalShotsHit += matchData.PlayerStatsTotal.ShotgunShotsHit;

			// Splattergun
			statistics.WeaponStatistics.SplattergunTotalDamageDone += matchData.PlayerStatsTotal.SplattergunDamageDone;
			statistics.WeaponStatistics.SplattergunTotalSplats += matchData.PlayerStatsTotal.SplattergunKills;
			statistics.WeaponStatistics.SplattergunTotalShotsFired += matchData.PlayerStatsTotal.SplattergunShotsFired;
			statistics.WeaponStatistics.SplattergunTotalShotsHit += matchData.PlayerStatsTotal.SplattergunShotsHit;

			// Sniper Rifle
			statistics.WeaponStatistics.SniperTotalDamageDone += matchData.PlayerStatsTotal.SniperDamageDone;
			statistics.WeaponStatistics.SniperTotalSplats += matchData.PlayerStatsTotal.SniperKills;
			statistics.WeaponStatistics.SniperTotalShotsFired += matchData.PlayerStatsTotal.SniperShotsFired;
			statistics.WeaponStatistics.SniperTotalShotsHit += matchData.PlayerStatsTotal.SniperShotsHit;

			// Melee Weapons
			statistics.WeaponStatistics.MeleeTotalDamageDone += matchData.PlayerStatsTotal.MeleeDamageDone;
			statistics.WeaponStatistics.MeleeTotalSplats += matchData.PlayerStatsTotal.MeleeKills;
			statistics.WeaponStatistics.MeleeTotalShotsFired += matchData.PlayerStatsTotal.MeleeShotsFired;
			statistics.WeaponStatistics.MeleeTotalShotsHit += matchData.PlayerStatsTotal.MeleeShotsHit;

			// Cannon
			statistics.WeaponStatistics.CannonTotalDamageDone += matchData.PlayerStatsTotal.CannonDamageDone;
			statistics.WeaponStatistics.CannonTotalSplats += matchData.PlayerStatsTotal.CannonKills;
			statistics.WeaponStatistics.CannonTotalShotsFired += matchData.PlayerStatsTotal.CannonShotsFired;
			statistics.WeaponStatistics.CannonTotalShotsHit += matchData.PlayerStatsTotal.CannonShotsHit;

			// Launcher
			statistics.WeaponStatistics.LauncherTotalDamageDone += matchData.PlayerStatsTotal.LauncherDamageDone;
			statistics.WeaponStatistics.LauncherTotalSplats += matchData.PlayerStatsTotal.LauncherKills;
			statistics.WeaponStatistics.LauncherTotalShotsFired += matchData.PlayerStatsTotal.LauncherShotsFired;
			statistics.WeaponStatistics.LauncherTotalShotsHit += matchData.PlayerStatsTotal.LauncherShotsHit;

			statistics.PersonalRecord.MostArmorPickedUp = Math.Max(statistics.PersonalRecord.MostArmorPickedUp, bestPerLifeStatistics.ArmorPickedUp);
			statistics.PersonalRecord.MostCannonSplats = Math.Max(statistics.PersonalRecord.MostCannonSplats, bestPerLifeStatistics.CannonKills);
			statistics.PersonalRecord.MostConsecutiveSnipes = Math.Max(statistics.PersonalRecord.MostConsecutiveSnipes, bestPerLifeStatistics.ConsecutiveSnipes);
			statistics.PersonalRecord.MostDamageDealt = Math.Max(statistics.PersonalRecord.MostDamageDealt, bestPerLifeStatistics.GetDamageDealt());
			statistics.PersonalRecord.MostDamageReceived = Math.Max(statistics.PersonalRecord.MostDamageReceived, bestPerLifeStatistics.DamageReceived);
			statistics.PersonalRecord.MostHeadshots = Math.Max(statistics.PersonalRecord.MostHeadshots, bestPerLifeStatistics.Headshots);
			statistics.PersonalRecord.MostHealthPickedUp = Math.Max(statistics.PersonalRecord.MostHealthPickedUp, bestPerLifeStatistics.HealthPickedUp);
			statistics.PersonalRecord.MostLauncherSplats = Math.Max(statistics.PersonalRecord.MostLauncherSplats, bestPerLifeStatistics.LauncherKills);
			statistics.PersonalRecord.MostMachinegunSplats = Math.Max(statistics.PersonalRecord.MostMachinegunSplats, bestPerLifeStatistics.MachineGunKills);
			statistics.PersonalRecord.MostMeleeSplats = Math.Max(statistics.PersonalRecord.MostMeleeSplats, bestPerLifeStatistics.MeleeKills);
			statistics.PersonalRecord.MostNutshots = Math.Max(statistics.PersonalRecord.MostNutshots, bestPerLifeStatistics.Nutshots);
			statistics.PersonalRecord.MostShotgunSplats = Math.Max(statistics.PersonalRecord.MostShotgunSplats, bestPerLifeStatistics.ShotgunSplats);
			statistics.PersonalRecord.MostSniperSplats = Math.Max(statistics.PersonalRecord.MostSniperSplats, bestPerLifeStatistics.SniperKills);
			statistics.PersonalRecord.MostSplats = Math.Max(statistics.PersonalRecord.MostSplats, totalStatistics.GetKills());
			statistics.PersonalRecord.MostSplattergunSplats = Math.Max(statistics.PersonalRecord.MostSplattergunSplats, bestPerLifeStatistics.SplattergunKills);
			statistics.PersonalRecord.MostXPEarned = Math.Max(statistics.PersonalRecord.MostXPEarned, totalStatistics.Xp);

			UserWebServiceClient.Instance.UpdatePlayerStatistics(player.AuthToken, statistics);
		}

		public List<StatsSummary> GetMostValuablePlayers() {
			var statsSummaries = new List<StatsSummary>();

			var achievements = room.AchievementManager.GetAchievements();

			foreach (var player in room.Players) {
				var playerAchievements = new Dictionary<byte, ushort>();

				// Most Valuable (Highest KD)
				if (achievements[AchievementType.MostValuable]?.Item1.CompareTo(player.Actor.Cmid) == 0) {
					playerAchievements.Add((byte)AchievementType.MostValuable, achievements[AchievementType.MostValuable].Item2);
				}

				// Most Aggressive (Most Kills Total)
				if (achievements[AchievementType.MostAggressive]?.Item1.CompareTo(player.Actor.Cmid) == 0) {
					playerAchievements.Add((byte)AchievementType.MostAggressive, achievements[AchievementType.MostAggressive].Item2);
				}

				// Sharpest Shooter (Most Critical Hits)
				if (achievements[AchievementType.SharpestShooter]?.Item1.CompareTo(player.Actor.Cmid) == 0) {
					playerAchievements.Add((byte)AchievementType.SharpestShooter, achievements[AchievementType.SharpestShooter].Item2);
				}

				// Most Trigger Happy (Highest Killstreak)
				if (achievements[AchievementType.TriggerHappy]?.Item1.CompareTo(player.Actor.Cmid) == 0) {
					playerAchievements.Add((byte)AchievementType.TriggerHappy, achievements[AchievementType.TriggerHappy].Item2);
				}

				// Hardest Hitter (Highest Damage Dealt)
				if (achievements[AchievementType.HardestHitter]?.Item1.CompareTo(player.Actor.Cmid) == 0) {
					playerAchievements.Add((byte)AchievementType.HardestHitter, achievements[AchievementType.HardestHitter].Item2);
				}

				// Cost Effective (Highest Accuracy)
				if (achievements[AchievementType.CostEffective]?.Item1.CompareTo(player.Actor.Cmid) == 0) {
					playerAchievements.Add((byte)AchievementType.CostEffective, achievements[AchievementType.CostEffective].Item2);
				}

				statsSummaries.Add(new StatsSummary {
					Cmid = player.Actor.Cmid,
					Achievements = playerAchievements,
					Deaths = GetDeaths(player) + GetSuicides(player),
					Kills = GetKills(player),
					Level = player.Actor.ActorInfo.Level,
					Name = player.Actor.ActorInfo.PlayerName,
					Team = player.Actor.ActorInfo.TeamID
				});
			}

			return statsSummaries.OrderByDescending(_ => _.Kills).ToList();
		}


		public short GetKills(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.Kills ?? 0;
		}

		public short GetDeaths(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.Deaths ?? 0;
		}

		public short GetSuicides(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.Suicides ?? 0;
		}

		public int GetHeadshots(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.MatchStatistics.Headshots ?? 0;
		}

		public int GetNutshots(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.MatchStatistics.Nutshots ?? 0;
		}

		public double GetKillDeathRatio(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.KillDeathRatio ?? 1;
		}

		public double GetAccuracy(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.Accuracy ?? 0;
		}


		public StatsCollection GetMatchStatistics(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.MatchStatistics;
		}

		public StatsCollection GetBestPerLifeStatistics(GamePeer player) {
			return Statistics[player.Actor.Cmid]?.GetBestPerLifeStatistics();
		}

		public void IncreaseHeadshots(GamePeer player, int headshots = 1) {
			Statistics[player.Actor.Cmid]?.IncreaseHeadshots(headshots);
		}

		public void IncreaseNutshots(GamePeer player, int nutshots = 1) {
			Statistics[player.Actor.Cmid]?.IncreaseNutshots(nutshots);
		}

		public void IncreaseConsecutiveSnipes(GamePeer player, int snipes = 1) {
			Statistics[player.Actor.Cmid]?.IncreaseConsecutiveSnipes(snipes);
		}

		public void IncreaseXp(GamePeer player, int xp) {
			Statistics[player.Actor.Cmid]?.IncreaseXp(xp);
		}

		public void IncreaseDamageReceived(GamePeer player, int receivedDamage) {
			Statistics[player.Actor.Cmid]?.IncreaseDamageReceived(receivedDamage);
		}

		public void IncreaseArmorPickedUp(GamePeer player, int armor) {
			Statistics[player.Actor.Cmid]?.IncreaseArmorPickedUp(armor);
		}

		public void IncreaseHealthPickedUp(GamePeer player, int health) {
			Statistics[player.Actor.Cmid]?.IncreaseHealthPickedUp(health);
		}

		public void IncreaseWeaponKills(GamePeer player, UberstrikeItemClass itemClass, BodyPart bodyPart) {
			Statistics[player.Actor.Cmid]?.IncreaseWeaponKills(itemClass, bodyPart);
		}

		public void IncreaseWeaponShotsFired(GamePeer player, UberstrikeItemClass itemClass, int shots) {
			Statistics[player.Actor.Cmid]?.IncreaseWeaponShotsFired(itemClass, shots);
		}

		public void IncreaseWeaponShotsHit(GamePeer player, UberstrikeItemClass itemClass, int shots = 1) {
			Statistics[player.Actor.Cmid]?.IncreaseWeaponShotsHit(itemClass, shots);
		}

		public void IncreaseWeaponDamageDone(GamePeer player, UberstrikeItemClass itemClass, int damage) {
			Statistics[player.Actor.Cmid]?.IncreaseWeaponDamageDone(itemClass, damage);
		}

		public void IncreaseDeaths(GamePeer player) {
			Statistics[player.Actor.Cmid]?.IncreaseDeaths();
		}

		public void IncreaseSuicides(GamePeer player) {
			Statistics[player.Actor.Cmid]?.IncreaseSuicides();
		}
	}
}
