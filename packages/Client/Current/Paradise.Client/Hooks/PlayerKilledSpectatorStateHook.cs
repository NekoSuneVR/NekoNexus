using HarmonyLib;
using System;
using System.Threading;

namespace Paradise.Client {
	/// <summary>
	/// Moves a player to Spectator state if killed while playing Team Elimination.
	/// </summary>
	[HarmonyPatch("PlayerKilledSpectatorState")]
	public static class PlayerKilledSpectatorStateHook {
		[HarmonyPatch("PlayerKilledSpectatorState", "OnEnter"), HarmonyPostfix]
		public static void OnEnter_Postfix() {
			using (var timer = new Timer(s => {
				if (GameState.Current.MatchState.CurrentStateId == GameStateId.MatchRunning) {
					GameState.Current.PlayerState.SetState(PlayerStateId.Spectating);
				}
			}, null, TimeSpan.FromSeconds(3).Milliseconds, Timeout.Infinite)) { }
		}
	}
}
