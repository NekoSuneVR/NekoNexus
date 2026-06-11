using HarmonyLib;
using UberStrike.Core.Models;
using UnityEngine;

namespace NekoNexus.Client {
	[HarmonyPatch(typeof(LocalPlayer))]
	public static class LocalPlayerHook {
		[HarmonyPatch("OnCharacterGrounded"), HarmonyPrefix]
		public static bool OnCharacterGrounded_Prefix(LocalPlayer __instance, float velocity) {
			if (/*GameState.Current.HasJoinedGame && GameState.Current.IsInGame &&*/ !WeaponFeedbackManager.IsBobbing && NekoNexusTraverse.GetField<float>(__instance, "_lastGrounded") + 0.5f < Time.time && !GameState.Current.PlayerData.Is(MoveStates.Diving)) {
				NekoNexusTraverse.SetField(__instance, "_lastGrounded", Time.time);

				if (__instance.Character != null && __instance.Character.Avatar != null && __instance.Character.Avatar.Decorator != null) {
					__instance.Character.Avatar.Decorator.PlayFootSound(__instance.Character.WalkingSoundSpeed);
					if (velocity < -20f) {
						LevelCamera.DoLandFeedback(true);

						if (NekoNexusClient.Settings.EnableLandingGrunt) {
							AutoMonoBehaviour<SfxManager>.Instance.Play2dAudioClip(GameAudio.LandingGrunt);
						}
					} else {
						LevelCamera.DoLandFeedback(false);
					}
				}
			}

			return false;
		}
	}
}
