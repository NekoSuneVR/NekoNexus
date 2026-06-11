using HarmonyLib;
using UberStrike.Core.Models;

namespace NekoNexus.Client {
	/// <summary>
	/// Fixed team assignment in Team Elimination
	/// </summary>
	[HarmonyPatch(typeof(TeamEliminationRoom))]
	public static class TeamEliminationRoomHook {
		[HarmonyPatch("OnPlayerJoinedGame"), HarmonyPrefix]
		public static bool OnPlayerJoinedGame_Prefix(TeamEliminationRoom __instance, GameActorInfo player, PlayerMovement position) {
			if (player.Cmid == PlayerDataManager.Cmid) {
				GameState.Current.PlayerData.Team.Value = player.TeamID;
			}

			return true;
		}
	}
}
