using System;

namespace NekoNexus.Realtime.Server.Game {
	/// <summary>
	/// Global "2x/5x" coin + xp boost event, pushed from the web service over the master socket
	/// (PacketType.SetBoost) and applied at match-end scoring in <see cref="StatisticsManager"/>.
	/// Lives in process memory on each Game server; the web service re-pushes the current value
	/// whenever a Game server (re)connects, so a restart can't lose it. A multiplier of 1 (or an
	/// elapsed EndsAt) means "no boost".
	/// </summary>
	public sealed class BoostState {
		/// <summary>Coin/points multiplier (1 = normal, 2 = double, 5 = quintuple).</summary>
		public int PointsMultiplier { get; set; } = 1;

		/// <summary>XP multiplier (1 = normal). Usually mirrors the coin boost but kept separate.</summary>
		public int XpMultiplier { get; set; } = 1;

		/// <summary>Unix epoch milliseconds when the boost ends; 0 = no expiry / runs until cleared.</summary>
		public long EndsAt { get; set; } = 0;

		private static long NowUnixMs => (long)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;

		/// <summary>True while the boost is live (a multiplier above 1 and not past its expiry).</summary>
		public bool IsActive => (PointsMultiplier > 1 || XpMultiplier > 1) && (EndsAt == 0 || NowUnixMs < EndsAt);

		/// <summary>Effective coin/points multiplier right now (1 when inactive/expired).</summary>
		public int EffectivePointsMultiplier => IsActive ? Math.Max(1, PointsMultiplier) : 1;

		/// <summary>Effective xp multiplier right now (1 when inactive/expired).</summary>
		public int EffectiveXpMultiplier => IsActive ? Math.Max(1, XpMultiplier) : 1;
	}
}
