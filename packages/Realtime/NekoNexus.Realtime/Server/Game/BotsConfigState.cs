namespace NekoNexus.Realtime.Server.Game {
	/// <summary>
	/// Admin-controlled AI fill-bots toggle (BETA), pushed from the web service over the master
	/// socket (PacketType.SetBotsConfig) and read by BaseGameRoom.Bots.cs instead of a YAML setting,
	/// so an admin can flip it live with no realtime restart. Lives in process memory on each Game
	/// server; the web service re-pushes the current value whenever a Game server (re)connects, so a
	/// restart can't lose it. Defaults to disabled - bots are BETA and opt-in.
	/// </summary>
	public sealed class BotsConfigState {
		/// <summary>Master switch. Off by default (BETA).</summary>
		public bool Enabled { get; set; } = false;

		/// <summary>Rooms are topped up with bots until humans + bots reach this number.</summary>
		public int FillTarget { get; set; } = 6;

		/// <summary>Hard cap on bots per room regardless of FillTarget.</summary>
		public int MaxBots { get; set; } = 5;
	}
}
