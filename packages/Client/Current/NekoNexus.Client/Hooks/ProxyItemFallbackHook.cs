using HarmonyLib;
using UnityEngine;

namespace NekoNexus.Client {
	/// <summary>
	/// Stops a single bad item from making the whole avatar (or a weapon) invisible.
	///
	/// The stock game's ProxyItem.Create returns NULL with no fallback when an item's prefab name is
	/// registered in the item config but Resources.Load can't actually load it. Loadout then just
	/// skips that null gear part - so a player wearing such a skin/gear shows up missing body parts
	/// (effectively invisible), and a broken weapon shows up as nothing in hand. Create is the single
	/// chokepoint for ALL item instantiation, so a postfix here substitutes the class default mesh
	/// whenever Create comes back null, for every gear part / weapon / quick item at once.
	/// (Note: gear never touches the player's CharacterController, so this is unrelated to the
	/// noclip-out-of-map report - that was the killed-spectator timing bug, fixed separately.)
	/// </summary>
	[HarmonyPatch(typeof(ProxyItem), "Create", new[] { typeof(Vector3), typeof(Quaternion) })]
	public static class ProxyItemFallbackHook {
		public static void Postfix(ProxyItem __instance, Vector3 position, Quaternion rotation, ref GameObject __result) {
			if (__result != null) {
				return; // prefab loaded fine - nothing to do
			}

			try {
				var view = __instance.View;
				if (view == null) {
					return;
				}

				if (!UnityItemConfiguration.Exists || UnityItemConfiguration.Instance == null) {
					return;
				}

				// GetDefaultItem returns a real default mesh PREFAB for gear/weapon classes (and null
				// for classes with no default, e.g. the holo base - which Loadout already covers with
				// DefaultAvatar). The null guard means we only ever substitute where it makes sense.
				var def = UnityItemConfiguration.Instance.GetDefaultItem(view.ItemClass);
				if (def == null) {
					return;
				}

				__result = UnityEngine.Object.Instantiate(def, position, rotation) as GameObject;
				NekoNexusClient.Log.Warn($"Item '{view.Name}' (ID {view.ID}) prefab failed to load; substituted default mesh for {view.ItemClass} so the player/weapon stays visible.");
			} catch (System.Exception ex) {
				Debug.LogWarning("ProxyItemFallbackHook failed: " + ex);
			}
		}
	}
}
