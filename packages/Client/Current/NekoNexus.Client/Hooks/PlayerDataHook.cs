using HarmonyLib;
using UberStrike.Core.Models;
using UberStrike.Core.Types;
using UnityEngine;

namespace NekoNexus.Client {
	[HarmonyPatch(typeof(PlayerData))]
	public static class PlayerDataHook {
		[HarmonyPatch("Reset"), HarmonyPrefix]
		public static bool Reset_Prefix(PlayerData __instance) {
			Singleton<LoadoutManager>.Instance.GetArmorValues(out var armorPoints);

			__instance.Player.ArmorPointCapacity = (byte)armorPoints;
			__instance.Player.PlayerState = PlayerStates.None;
			NekoNexusTraverse.SetProperty(__instance, "KeyState", KeyState.Still);
			__instance.MovementState = MoveStates.None;
			__instance.Velocity = Vector3.zero;

			// If the player is in Training mode, reset these to local values
			// Otherwise these values will be provided by the server
			if (GameState.Current.GameMode == GameModeType.None) {
				__instance.Health.Value = 100;
				__instance.ArmorPoints.Value = armorPoints;
			}

			return false;
		}
	}
}
