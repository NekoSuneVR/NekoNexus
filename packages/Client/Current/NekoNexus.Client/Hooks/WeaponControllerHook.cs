using HarmonyLib;
using UberStrike.Core.Models.Views;
using UberStrike.Core.Types;
using UberStrike.Realtime.UnitySdk;
using UnityEngine;

namespace NekoNexus.Client {
	/// <summary>
	/// <br>• Enables weapon quick switching if the game's flag is set or the player is exploring maps.</br>
	/// <br>• Limits the player loadout to melee weapons if "Melee Only" game flag is set</br>
	/// </summary>
	[HarmonyPatch(typeof(WeaponController))]
	public static class WeaponControllerHook {
		private static NekoNexusTraverse<WeaponController> traverse;

		[HarmonyPatch("Shoot"), HarmonyPostfix]
		public static void Shoot_Postfix(WeaponController __instance, ref bool __result) {
			if (GameFlags.IsFlagSet(GameFlags.GAME_FLAGS.QuickSwitch, GameState.Current.RoomData.GameFlags) ||
				GameState.Current.GameMode == GameModeType.None) {
				traverse.SetField("_holsterTime", 0);
			}
		}

		[HarmonyPatch("InitializeAllWeapons"), HarmonyPrefix]
		public static bool InitializeAllWeapons_Prefix(WeaponController __instance, Transform attachPoint) {
			if (traverse == null) {
				traverse = NekoNexusTraverse<WeaponController>.Create(__instance);
			}

			for (int i = 0; i < traverse.GetField<WeaponSlot[]>("_weapons").Length; i++) {
				if (traverse.GetField<WeaponSlot[]>("_weapons")[i] != null && traverse.GetField<WeaponSlot[]>("_weapons")[i].Decorator != null) {
					UnityEngine.Object.Destroy(traverse.GetField<WeaponSlot[]>("_weapons")[i].Decorator.gameObject);
				}

				traverse.GetField<WeaponSlot[]>("_weapons")[i] = null;
			}

			for (int j = 0; j < LoadoutManager.WeaponSlots.Length; j++) {
				var loadoutSlotType = LoadoutManager.WeaponSlots[j];

				if (GameFlags.IsFlagSet(GameFlags.GAME_FLAGS.MeleeOnly, GameState.Current.RoomData.GameFlags) && GameState.Current.RoomData.GameMode != GameModeType.None && loadoutSlotType != LoadoutSlotType.WeaponMelee) {
					traverse.InvokeMethod("SetSlotWeapon", loadoutSlotType, null);
					continue;
				}

				InventoryItem inventoryItem;

				if (Singleton<LoadoutManager>.Instance.TryGetItemInSlot(loadoutSlotType, out inventoryItem)) {
					WeaponSlot weaponSlot = new WeaponSlot(loadoutSlotType, inventoryItem.Item, attachPoint, __instance);
					traverse.InvokeMethod("AddGameLogicToWeapon", weaponSlot);

					traverse.GetField<WeaponSlot[]>("_weapons")[j] = weaponSlot;

					AmmoDepot.SetMaxAmmoForType(inventoryItem.Item.View.ItemClass, ((UberStrikeItemWeaponView)inventoryItem.Item.View).MaxAmmo);
					AmmoDepot.SetStartAmmoForType(inventoryItem.Item.View.ItemClass, ((UberStrikeItemWeaponView)inventoryItem.Item.View).StartAmmo);

					traverse.InvokeMethod("SetSlotWeapon", loadoutSlotType, inventoryItem.Item);
				} else {
					traverse.InvokeMethod("SetSlotWeapon", loadoutSlotType, null);
				}
			}

			GameState.Current.PlayerData.LoadoutWeapons.Value = __instance.LoadoutWeapons;
			Singleton<QuickItemController>.Instance.Initialize();
			__instance.Reset();

			return false;
		}
	}
}
