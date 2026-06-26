using HarmonyLib;
using System;
using System.Threading;

namespace NekoNexus.Client {
	/// <summary>
	/// Moves a player to Spectator state if killed while playing Team Elimination.
	/// </summary>
	[HarmonyPatch("PlayerKilledSpectatorState")]
	public static class PlayerKilledSpectatorStateHook {
		[HarmonyPatch("PlayerKilledSpectatorState", "OnEnter"), HarmonyPostfix]
		public static void OnEnter_Postfix() {
			// Two bugs were making killed players flip to free-spectator (noclip/invisible) at the
			// WRONG time: (1) the timer was wrapped in `using`, so it was disposed immediately and
			// could fire unreliably or not at all; (2) TimeSpan.FromSeconds(3).Milliseconds is 0 (the
			// sub-second component of a whole-second span), so when it did fire it was instant instead
			// of after 3s. Keep a live reference, use the full 3000 ms, and self-dispose in the
			// callback. Re-check the player is still dead so a respawn before the delay won't yank a
			// living player into spectator.
			Timer timer = null;
			timer = new Timer(_ => {
				try {
					if (GameState.Current.MatchState.CurrentStateId == GameStateId.MatchRunning
						&& GameState.Current.PlayerState.CurrentStateId == PlayerStateId.Killed) {
						GameState.Current.PlayerState.SetState(PlayerStateId.Spectating);
					}
				} catch (Exception ex) {
					UnityEngine.Debug.LogWarning("PlayerKilledSpectatorStateHook timer failed: " + ex);
				} finally {
					timer?.Dispose();
				}
			}, null, (int)TimeSpan.FromSeconds(3).TotalMilliseconds, Timeout.Infinite);
		}
	}
}
