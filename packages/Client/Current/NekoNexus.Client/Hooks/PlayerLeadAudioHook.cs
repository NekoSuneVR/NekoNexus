using HarmonyLib;
using UberStrike.Core.Types;

namespace NekoNexus.Client {
	/// <summary>
	/// Disables player lead audio (n kills left, taken/lost/tied for the lead) in Team Elimination games.
	/// </summary>
	[HarmonyPatch(typeof(PlayerLeadAudio))]
	public static class PlayerLeadAudioHook {
		[HarmonyPatch("UpdateLeadStatus"), HarmonyPrefix]
		public static bool UpdateLeadStatus_Prefix() {
			if (GameState.Current.GameMode == GameModeType.EliminationMode ||
				GameState.Current.MatchState.CurrentStateId == GameStateId.PrepareNextRound)
				return false;

			return true;
		}

		[HarmonyPatch("PlayKillsLeftAudio"), HarmonyPrefix]
		public static bool PlayKillsLeftAudio_Prefix() {
			if (GameState.Current.GameMode == GameModeType.EliminationMode ||
				GameState.Current.MatchState.CurrentStateId == GameStateId.PrepareNextRound)
				return false;

			return true;
		}
	}
}
