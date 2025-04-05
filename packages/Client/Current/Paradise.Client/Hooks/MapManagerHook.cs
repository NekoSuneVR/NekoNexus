using HarmonyLib;
using System;

namespace Paradise.Client {
	/// <summary>
	/// Allows for loading custom local maps.
	/// </summary>
	[HarmonyPatch(typeof(MapManager))]
	public static class MapManagerHook {
		[HarmonyPatch("LoadMap"), HarmonyPrefix]
		public static bool LoadMap_Prefix(MapManager __instance, UberstrikeMap map, Action onSuccess) {
			PickupItem.Reset();

			if (ParadiseMapManager.IsBundleMap(map.Id)) {
				ParadiseMapManager.LoadBundle(map.Id, delegate {
					Singleton<SceneLoader>.Instance.LoadLevel(map.SceneName, onSuccess);
				});
			} else {
				Singleton<SceneLoader>.Instance.LoadLevel(map.SceneName, onSuccess);
			}

			return false;
		}
	}
}
