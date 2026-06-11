using System;
using System.Collections.Generic;
using System.Linq;
using UberStrike.Core.Models;

namespace NekoNexus.Realtime.Server.Game {
	public class AchievementManager {
		private BaseGameRoom room;

		public AchievementManager(BaseGameRoom room) {
			this.room = room;
		}

		public Dictionary<AchievementType, Tuple<int, ushort>> GetAchievements() {
			return new Dictionary<AchievementType, Tuple<int, ushort>> {
				[AchievementType.MostValuable] = GetMostValuable().FirstOrDefault(),
				[AchievementType.MostAggressive] = GetMostAggressive().FirstOrDefault(),
				[AchievementType.SharpestShooter] = GetSharpestShooter().FirstOrDefault(),
				[AchievementType.TriggerHappy] = GetMostTriggerHappy().FirstOrDefault(),
				[AchievementType.HardestHitter] = GetHardestHitter().FirstOrDefault(),
				[AchievementType.CostEffective] = GetCostEffective().FirstOrDefault()
			};
		}

		// Most Valuable (Highest KD)
		public List<Tuple<int, ushort>> GetMostValuable() {
			var players = room.Players
				.Select(_ => new Tuple<int, ushort>(_.Actor.Cmid, Convert.ToUInt16(room.StatisticsManager.GetKillDeathRatio(_) * 10)))
				.OrderByDescending(_ => _.Item2)
				.Where(_ => _.Item2 > 0)
				.ToList();

			return players;
		}

		// Most Aggressive (Most Kills Total)
		public List<Tuple<int, ushort>> GetMostAggressive() {
			var players = room.Players
				.Select(_ => new Tuple<int, ushort>(_.Actor.Cmid, (ushort)room.StatisticsManager.GetKills(_)))
				.OrderByDescending(_ => _.Item2)
				.Where(_ => _.Item2 > 0)
				.ToList();

			return players;
		}

		// Sharpest Shooter (Most Critical Hits)
		public List<Tuple<int, ushort>> GetSharpestShooter() {
			var players = room.Players
				.Select(_ => new Tuple<int, ushort>(_.Actor.Cmid, (ushort)(room.StatisticsManager.GetHeadshots(_) + room.StatisticsManager.GetNutshots(_))))
				.OrderByDescending(_ => _.Item2)
				.Where(_ => _.Item2 > 0)
				.ToList();

			return players;
		}

		// Most Trigger Happy (Highest Killstreak)
		public List<Tuple<int, ushort>> GetMostTriggerHappy() {
			var players = room.Players
				.Select(_ => new Tuple<int, ushort>(_.Actor.Cmid, (ushort)room.StatisticsManager.GetBestPerLifeStatistics(_).GetKills()))
				.OrderByDescending(_ => _.Item2)
				.Where(_ => _.Item2 > 0)
				.ToList();

			return players;
		}

		// Hardest Hitter (Highest Damage Dealt)
		public List<Tuple<int, ushort>> GetHardestHitter() {
			var players = room.Players
				.Select(_ => new Tuple<int, ushort>(_.Actor.Cmid, (ushort)room.StatisticsManager.GetMatchStatistics(_).GetDamageDealt()))
				.OrderByDescending(_ => _.Item2)
				.Where(_ => _.Item2 > 0)
				.ToList();

			return players;
		}

		// Cost Effective (Highest Accuracy)
		public List<Tuple<int, ushort>> GetCostEffective() {
			var players = room.Players
				.Select(_ => new Tuple<int, ushort>(_.Actor.Cmid, Convert.ToUInt16(room.StatisticsManager.GetAccuracy(_) * 10)))
				.OrderByDescending(_ => _.Item2)
				.Where(_ => _.Item2 > 0)
				.ToList();

			return players;
		}
	}
}
