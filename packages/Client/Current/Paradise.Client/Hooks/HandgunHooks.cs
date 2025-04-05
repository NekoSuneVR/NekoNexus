using HarmonyLib;
using System.Collections.Generic;
using System.IO;
using UberStrike.Core.Models;
using UberStrike.Core.Models.Views;
using UberStrike.Core.Serialization;
using UberStrike.Core.Types;
using UberStrike.DataCenter.Common.Entities;
using UnityEngine;

namespace Paradise.Client {
	/// <summary>
	/// Collection of hooks to make handguns in the "Handguns" shop category usable again
	/// </summary>
	[HarmonyPatch]
	public static class HandgunHooks {
		//[HarmonyPatch(typeof(AmmoDepot), "SetMaxAmmoForType"), HarmonyPrefix]
		public static bool AmmoDepot_SetMaxAmmoForType_Prefix(UberstrikeItemClass weaponClass, int maxAmmoCount) {
			if (PlayerDataManager.IsPlayerLoggedIn && weaponClass == (UberstrikeItemClass)2) {
				((Dictionary<AmmoType, int>)AccessTools.Property(typeof(AmmoDepot), "_maxAmmo").GetValue(null, null))[AmmoType.Machinegun] = maxAmmoCount;

				return false;
			}

			return true;
		}

		//[HarmonyPatch(typeof(AmmoDepot), "SetStartAmmoForType"), HarmonyPrefix]
		public static bool AmmoDepot_SetStartAmmoForType_Prefix(UberstrikeItemClass weaponClass, int startAmmoCount) {
			if (PlayerDataManager.IsPlayerLoggedIn && weaponClass == (UberstrikeItemClass)2) {
				((Dictionary<AmmoType, int>)AccessTools.Property(typeof(AmmoDepot), "_startAmmo").GetValue(null, null))[AmmoType.Machinegun] = startAmmoCount;

				return false;
			}

			return true;
		}

		[HarmonyPatch(typeof(AmmoDepot), "TryGetAmmoType"), HarmonyPrefix]
		public static bool AmmoDepot_TryGetAmmoType_Prefix(ref bool __result, UberstrikeItemClass item, ref AmmoType t) {
			if (item == (UberstrikeItemClass)2) {
				t = AmmoType.Machinegun;
				__result = true;

				return false;
			}

			return true;
		}

		[HarmonyPatch(typeof(AvatarAnimationController), "ChangeWeaponType"), HarmonyPrefix]
		public static bool AvatarAnimationController_ChangeWeaponType_Prefix(AvatarAnimationController __instance, UberstrikeItemClass itemClass) {
			if (__instance.Animator != null && itemClass == (UberstrikeItemClass)2) {
				ParadiseTraverse.SetField(__instance, "weaponSwitch", true);

				__instance.Animator.SetInteger((int)AccessTools.TypeByName("AvatarAnimationController+ControlFields").GetField("WeaponClass").GetValue(null), 2);

				return false;
			}

			return true;
		}

		//[HarmonyPatch(typeof(DefaultItemUtil), "GetDefaultWeaponView"), HarmonyPrefix]
		public static bool DefaultItemUtil_GetDefaultWeaponView_Prefix(ref UberStrikeItemWeaponView __result, UberstrikeItemClass itemClass) {
			if (itemClass == (UberstrikeItemClass)2) {
				// TODO: Complete weapon statistics
				__result = new UberStrikeItemWeaponView {

				};

				return false;
			}

			return true;
		}

		[HarmonyPatch(typeof(HUDReticleController), "Start"), HarmonyPrefix]
		public static bool HUDReticleController_Start_Prefix(HUDReticleController __instance) {
			ParadiseTraverse.GetField<Dictionary<UberstrikeItemClass, ReticleView>>(__instance, "reticles").Add((UberstrikeItemClass)2, ParadiseTraverse.GetField<ReticleView>(__instance, "machinegun"));

			return true;
		}

		[HarmonyPatch(typeof(ItemManager), "GetDefaultWeaponItem"), HarmonyPrefix]
		public static bool ItemManager_GetDefaultWeaponItem_Prefix(ref GameObject __result, UberstrikeItemClass itemClass) {
			if (itemClass == (UberstrikeItemClass)2) {
				WeaponItem weaponItem = UnityItemConfiguration.Instance.UnityItemsDefaultWeapons.Find((WeaponItem item) => item.name.Equals("Handgun"));
				__result = (!(weaponItem != null)) ? null : weaponItem.gameObject;

				return false;
			}

			return true;
		}

		[HarmonyPatch(typeof(ShopPageGUI), "Start"), HarmonyPostfix]
		public static void ShopPageGUI_Start_Postfix(ShopPageGUI __instance) {
			var typeSelection = new SelectionGroup<UberstrikeItemType>();

			typeSelection.Add(UberstrikeItemType.Weapon, new GUIContent(ShopIcons.WeaponItems, LocalizedStrings.Weapons));
			typeSelection.Add(UberstrikeItemType.Gear, new GUIContent(ShopIcons.GearItems, LocalizedStrings.Gear));
			typeSelection.Add(UberstrikeItemType.QuickUse, new GUIContent(ShopIcons.QuickItems, LocalizedStrings.QuickItems));
			typeSelection.Add(UberstrikeItemType.Functional, new GUIContent(ShopIcons.FunctionalItems, LocalizedStrings.FunctionalItems));
			typeSelection.OnSelectionChange += delegate (UberstrikeItemType itemType) {
				ParadiseTraverse.InvokeMethod(__instance, "UpdateItemFilter");
			};

			typeSelection.Select(UberstrikeItemType.Weapon);

			ParadiseTraverse.SetField(__instance, "_typeSelection", typeSelection);

			var weaponClassSelection = new SelectionGroup<UberstrikeItemClass>();

			weaponClassSelection.Add(UberstrikeItemClass.WeaponMelee, new GUIContent(ShopIcons.StatsMostWeaponSplatsMelee, LocalizedStrings.MeleeWeapons));
			weaponClassSelection.Add((UberstrikeItemClass)2, new GUIContent(ShopIcons.StatsMostWeaponSplatsHandgun, "Handguns"));
			weaponClassSelection.Add(UberstrikeItemClass.WeaponMachinegun, new GUIContent(ShopIcons.StatsMostWeaponSplatsMachinegun, LocalizedStrings.Machineguns));
			weaponClassSelection.Add(UberstrikeItemClass.WeaponShotgun, new GUIContent(ShopIcons.StatsMostWeaponSplatsShotgun, LocalizedStrings.Shotguns));
			weaponClassSelection.Add(UberstrikeItemClass.WeaponSniperRifle, new GUIContent(ShopIcons.StatsMostWeaponSplatsSniperRifle, LocalizedStrings.SniperRifles));
			weaponClassSelection.Add(UberstrikeItemClass.WeaponCannon, new GUIContent(ShopIcons.StatsMostWeaponSplatsCannon, LocalizedStrings.Cannons));
			weaponClassSelection.Add(UberstrikeItemClass.WeaponSplattergun, new GUIContent(ShopIcons.StatsMostWeaponSplatsSplattergun, LocalizedStrings.Splatterguns));
			weaponClassSelection.Add(UberstrikeItemClass.WeaponLauncher, new GUIContent(ShopIcons.StatsMostWeaponSplatsLauncher, LocalizedStrings.Launchers));

			weaponClassSelection.OnSelectionChange += delegate (UberstrikeItemClass itemClass) {
				ParadiseTraverse.InvokeMethod(__instance, "UpdateItemFilter");
			};

			weaponClassSelection.SetIndex(-1);

			ParadiseTraverse.SetField(__instance, "_weaponClassSelection", weaponClassSelection);

			ParadiseTraverse.InvokeMethod(__instance, "UpdateItemFilter");
		}

		[HarmonyPatch(typeof(ShopUtils), "IsInstantHitWeapon"), HarmonyPostfix]
		public static void ShopUtils_IsInstantHitWeapon_Postfix(ref bool __result, IUnityItem view) {
			__result = view != null && view.View != null && (__result || view.View.ItemClass == (UberstrikeItemClass)2);
		}

		[HarmonyPatch(typeof(UberstrikeIconsHelper), "GetIconForItemClass"), HarmonyPrefix]
		public static bool UberstrikeIconsHelper_GetItemForIconClass_Prefix(ref Texture2D __result, UberstrikeItemClass itemClass) {
			if (itemClass == (UberstrikeItemClass)2) {
				__result = ShopIcons.StatsMostWeaponSplatsHandgun;

				return false;
			}

			return true;
		}

		[HarmonyPatch(typeof(UnityItemConfiguration), "GetDefaultIcon"), HarmonyPrefix]
		public static bool UnityItemConfiguration_GetDefaultIcon_Prefix(UnityItemConfiguration __instance, ref Texture2D __result, UberstrikeItemClass itemClass) {
			if (itemClass == (UberstrikeItemClass)2) {
				__result = __instance.DefaultWeaponIcons.Find((Texture2D icon) => icon.name.Contains("Handgun"));

				return false;
			}

			return true;
		}

		[HarmonyPatch(typeof(WeaponSlot), "CreateWeaponLogic"), HarmonyPrefix]
		public static bool WeaponSlot_CreateWeaponLogic_Prefix(WeaponSlot __instance, UberStrikeItemWeaponView view, IWeaponController controller) {
			if (view.ItemClass == (UberstrikeItemClass)2) {
				ParadiseTraverse.SetProperty(__instance, "Decorator", ParadiseTraverse.InvokeMethod(__instance, "InstantiateWeaponDecorator", view.ID));
				ParadiseTraverse.SetProperty(__instance, "Item", __instance.Decorator.GetComponent<WeaponItem>());

				if (view.ProjectilesPerShot > 1) {
					ParadiseTraverse.SetProperty(__instance, "Logic", new InstantMultiHitWeapon(__instance.Item, __instance.Decorator, view.ProjectilesPerShot, controller, view));
				} else {
					ParadiseTraverse.SetProperty(__instance, "Logic", new InstantHitWeapon(__instance.Item, __instance.Decorator, controller, view));
				}

				return false;
			}

			return true;
		}

		#region Statistics
		#region StatsCollection
		[HarmonyPatch(typeof(StatsCollection), "GetKills"), HarmonyPrefix]
		public static bool StatsCollection_GetKills_Prefix(StatsCollection __instance, ref int __result) {
			__result = (__instance.MeleeKills + __instance.GetProps().HandgunKills + __instance.MachineGunKills
			  + __instance.ShotgunSplats + __instance.SniperKills + __instance.SplattergunKills
			  + __instance.CannonKills + __instance.LauncherKills) - __instance.Suicides;

			return false;
		}

		[HarmonyPatch(typeof(StatsCollection), "GetShots"), HarmonyPrefix]
		public static bool StatsCollection_GetShots_Prefix(StatsCollection __instance, ref int __result) {
			__result = __instance.MeleeShotsFired + __instance.GetProps().HandgunShotsFired + __instance.MachineGunShotsFired
			  + __instance.ShotgunShotsFired + __instance.SniperShotsFired + __instance.SplattergunShotsFired
			  + __instance.CannonShotsFired + __instance.LauncherShotsFired;

			return false;
		}

		[HarmonyPatch(typeof(StatsCollection), "GetHits"), HarmonyPrefix]
		public static bool StatsCollection_GetHits_Prefix(StatsCollection __instance, ref int __result) {
			__result = __instance.MeleeShotsHit + __instance.GetProps().HandgunShotsHit + __instance.MachineGunShotsHit
			  + __instance.ShotgunShotsHit + __instance.SniperShotsHit + __instance.SplattergunShotsHit
			  + __instance.CannonShotsHit + __instance.LauncherShotsHit;

			return false;
		}

		[HarmonyPatch(typeof(StatsCollection), "GetDamageDealt"), HarmonyPrefix]
		public static bool StatsCollection_GetDamageDealt_Prefix(StatsCollection __instance, ref int __result) {
			__result = __instance.MeleeDamageDone + __instance.GetProps().HandgunDamageDone + __instance.MachineGunDamageDone
			  + __instance.ShotgunDamageDone + __instance.SniperDamageDone + __instance.SplattergunDamageDone
			  + __instance.CannonDamageDone + __instance.LauncherDamageDone;

			return false;
		}
		#endregion

		[HarmonyPatch(typeof(PlayerDataManager), "UpdatePlayerStats"), HarmonyPostfix]
		public static void UpdatePlayerStats_Postfix(PlayerDataManager __instance, StatsCollection stats, StatsCollection best) {
			var serverLocalPlayerStatisticsView = __instance.ServerLocalPlayerStatisticsView;

			if (serverLocalPlayerStatisticsView != null) {
				serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalSplats = serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalSplats + stats.GetProps().HandgunKills;
				serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalShotsFired = serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalShotsFired + stats.GetProps().HandgunShotsFired;
				serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalShotsHit = serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalShotsHit + stats.GetProps().HandgunShotsHit;
				serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalDamageDone = serverLocalPlayerStatisticsView.WeaponStatistics.GetProps().HandgunTotalDamageDone + stats.GetProps().HandgunDamageDone;
			}
		}

		#region StatsCollectionProxy
		[HarmonyPatch(typeof(StatsCollectionProxy), "Serialize"), HarmonyPostfix]
		public static void StatsCollectionProxy_Serialize_Postfix(Stream stream, StatsCollection instance) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunDamageDone);
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunKills);
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunShotsFired);
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunShotsHit);
				memoryStream.WriteTo(stream);
			}
		}

		[HarmonyPatch(typeof(StatsCollectionProxy), "Deserialize"), HarmonyPostfix]
		public static void StatsCollectionProxy_Deserialize_Postfix(ref StatsCollection __result, Stream bytes) {
			__result.GetProps().HandgunDamageDone = Int32Proxy.Deserialize(bytes);
			__result.GetProps().HandgunKills = Int32Proxy.Deserialize(bytes);
			__result.GetProps().HandgunShotsFired = Int32Proxy.Deserialize(bytes);
			__result.GetProps().HandgunShotsHit = Int32Proxy.Deserialize(bytes);
		}
		#endregion

		#region PlayerPersonalRecordStatisticsViewProxy
		[HarmonyPatch(typeof(PlayerPersonalRecordStatisticsViewProxy), "Serialize"), HarmonyPostfix]
		public static void PlayerPersonalRecordStatisticsViewProxy_Serialize_Postfix(Stream stream, PlayerPersonalRecordStatisticsView instance) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				Int32Proxy.Serialize(memoryStream, instance.GetProps().MostHandgunSplats);
				memoryStream.WriteTo(stream);
			}
		}

		[HarmonyPatch(typeof(PlayerPersonalRecordStatisticsViewProxy), "Deserialize"), HarmonyPostfix]
		public static void PlayerPersonalRecordStatisticsViewProxy_Deserialize_Postfix(ref PlayerPersonalRecordStatisticsView __result, Stream bytes) {
			__result.GetProps().MostHandgunSplats = Int32Proxy.Deserialize(bytes);
		}
		#endregion

		#region PlayerWeaponStatisticsViewProxy
		[HarmonyPatch(typeof(PlayerWeaponStatisticsViewProxy), "Serialize"), HarmonyPostfix]
		public static void PlayerWeaponStatisticsViewProxy_Serialize_Postfix(Stream stream, PlayerWeaponStatisticsView instance) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunTotalDamageDone);
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunTotalShotsFired);
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunTotalShotsHit);
				Int32Proxy.Serialize(memoryStream, instance.GetProps().HandgunTotalSplats);
				memoryStream.WriteTo(stream);
			}
		}

		[HarmonyPatch(typeof(PlayerWeaponStatisticsViewProxy), "Deserialize"), HarmonyPostfix]
		public static void PlayerWeaponStatisticsViewProxy_Deserialize_Postfix(ref PlayerWeaponStatisticsView __result, Stream bytes) {
			__result.GetProps().HandgunTotalDamageDone = Int32Proxy.Deserialize(bytes);
			__result.GetProps().HandgunTotalShotsFired = Int32Proxy.Deserialize(bytes);
			__result.GetProps().HandgunTotalShotsHit = Int32Proxy.Deserialize(bytes);
			__result.GetProps().HandgunTotalSplats = Int32Proxy.Deserialize(bytes);
		}
		#endregion
		#endregion
	}

	#region Extensions
	public class StatsCollectionProperties {
		public int HandgunKills { get; set; }
		public int HandgunShotsFired { get; set; }
		public int HandgunShotsHit { get; set; }
		public int HandgunDamageDone { get; set; }

		public override string ToString() {
			return $"HandgunKills: {HandgunKills}; HandgunShotsFired: {HandgunShotsFired}; HandgunShotsHit: {HandgunShotsHit}; HandgunDamageDone: {HandgunDamageDone}";
		}
	}

	public static class StatsCollectionExtensions {
		private static readonly Dictionary<StatsCollection, StatsCollectionProperties> data = new Dictionary<StatsCollection, StatsCollectionProperties>();

		public static StatsCollectionProperties GetProps(this StatsCollection obj) {
			if (!data.TryGetValue(obj, out var value)) {
				data[obj] = new StatsCollectionProperties();
				return data[obj];
			}

			return value;
		}

		public static string ToString2(this StatsCollection obj) {
			return $"[Headshots = {obj.Headshots}]"
			 + $"[Nutshots = {obj.Nutshots}]"
			 + $"[ConsecutiveSnipes = {obj.ConsecutiveSnipes}]"
			 + $"[Xp = {obj.Xp}]"
			 + $"[Deaths = {obj.Deaths}]"
			 + $"[DamageReceived = {obj.DamageReceived}]"
			 + $"[ArmorPickedUp = {obj.ArmorPickedUp}]"
			 + $"[HealthPickedUp = {obj.HealthPickedUp}]"
			 + $"[MeleeKills = {obj.MeleeKills}]"
			 + $"[MeleeShotsFired = {obj.MeleeShotsFired}]"
			 + $"[MeleeShotsHit = {obj.MeleeShotsHit}]"
			 + $"[MeleeDamageDone = {obj.MeleeDamageDone}]"
			 + $"[MachineGunKills = {obj.MachineGunKills}]"
			 + $"[MachineGunShotsFired = {obj.MachineGunShotsFired}]"
			 + $"[MachineGunShotsHit = {obj.MachineGunShotsHit}]"
			 + $"[MachineGunDamageDone = {obj.MachineGunDamageDone}]"
			 + $"[ShotgunSplats = {obj.ShotgunSplats}]"
			 + $"[ShotgunShotsFired = {obj.ShotgunShotsFired}]"
			 + $"[ShotgunShotsHit = {obj.ShotgunShotsHit}]"
			 + $"[ShotgunDamageDone = {obj.ShotgunDamageDone}]"
			 + $"[SniperKills = {obj.SniperKills}]"
			 + $"[SniperShotsFired = {obj.SniperShotsFired}]"
			 + $"[SniperShotsHit = {obj.SniperShotsHit}]"
			 + $"[SniperDamageDone = {obj.SniperDamageDone}]"
			 + $"[SplattergunKills = {obj.SplattergunKills}]"
			 + $"[SplattergunShotsFired = {obj.SplattergunShotsFired}]"
			 + $"[SplattergunShotsHit = {obj.SplattergunShotsHit}]"
			 + $"[SplattergunDamageDone = {obj.SplattergunDamageDone}]"
			 + $"[CannonKills = {obj.CannonKills}]"
			 + $"[CannonShotsFired = {obj.CannonShotsFired}]"
			 + $"[CannonShotsHit = {obj.CannonShotsHit}]"
			 + $"[CannonDamageDone = {obj.CannonDamageDone}]"
			 + $"[LauncherKills = {obj.LauncherKills}]"
			 + $"[LauncherShotsFired = {obj.LauncherShotsFired}]"
			 + $"[LauncherShotsHit = {obj.LauncherShotsHit}]"
			 + $"[LauncherDamageDone = {obj.LauncherDamageDone}]"
			 + $"[Suicides = {obj.Suicides}]"
			 + $"[Points = {obj.Points}]"
			 + obj.GetProps().ToString();
		}
	}

	public class PlayerPersonalRecordStatisticsViewProperties {
		public int MostHandgunSplats { get; set; }

		public override string ToString() {
			return $"MostHandgunSplats: {MostHandgunSplats}";
		}
	}

	public static class PlayerPersonalRecordStatisticsViewExtensions {
		private static readonly Dictionary<PlayerPersonalRecordStatisticsView, PlayerPersonalRecordStatisticsViewProperties> data = new Dictionary<PlayerPersonalRecordStatisticsView, PlayerPersonalRecordStatisticsViewProperties>();

		public static PlayerPersonalRecordStatisticsViewProperties GetProps(this PlayerPersonalRecordStatisticsView obj) {
			if (!data.TryGetValue(obj, out var value)) {
				data[obj] = new PlayerPersonalRecordStatisticsViewProperties();
				return data[obj];
			}

			return value;
		}
	}

	public class PlayerWeaponStatisticViewProperties {
		public int HandgunTotalSplats { get; set; }
		public int HandgunTotalShotsFired { get; set; }
		public int HandgunTotalShotsHit { get; set; }
		public int HandgunTotalDamageDone { get; set; }

		public override string ToString() {
			return $"HandgunTotalSplats: {HandgunTotalSplats}; HandgunTotalShotsFired: {HandgunTotalShotsFired}; HandgunTotalShotsHit: {HandgunTotalShotsHit}; HandgunTotalDamageDone: {HandgunTotalDamageDone}";
		}
	}

	public static class PlayerWeaponStatisticViewExtensions {
		private static readonly Dictionary<PlayerWeaponStatisticsView, PlayerWeaponStatisticViewProperties> data = new Dictionary<PlayerWeaponStatisticsView, PlayerWeaponStatisticViewProperties>();

		public static PlayerWeaponStatisticViewProperties GetProps(this PlayerWeaponStatisticsView obj) {
			if (!data.TryGetValue(obj, out var value)) {
				data[obj] = new PlayerWeaponStatisticViewProperties();
				return data[obj];
			}

			return value;
		}
	}
	#endregion
}
