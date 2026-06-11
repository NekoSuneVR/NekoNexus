using Cmune.DataCenter.Common.Entities;
using HarmonyLib;
using System;

namespace NekoNexus.Client {
	[HarmonyPatch]
	public static class ItemFilterHook {
		//[HarmonyPatch(typeof(InventoryItemFilter), "CanPass"), HarmonyPostfix]
		public static void InventoryItemFilter_CanPass_Postfix(ref bool __result, IUnityItem item) {
			__result = __result && CheckRank(item);
		}

		[HarmonyPatch(typeof(ItemByClassFilter), "CanPass"), HarmonyPostfix]
		public static void ItemByClassFilter_CanPass_Postfix(ref bool __result, IUnityItem item) {
			__result = __result && CheckRank(item);
		}

		[HarmonyPatch(typeof(ItemByTypeFilter), "CanPass"), HarmonyPostfix]
		public static void ItemByTypeFilter_CanPass_Postfix(ref bool __result, IUnityItem item) {
			__result = __result && CheckRank(item);
		}

		[HarmonyPatch(typeof(SpecialItemFilter), "CanPass"), HarmonyPostfix]
		public static void SpecialItemFilter_CanPass_Postfix(ref bool __result, IUnityItem item) {
			__result = __result && CheckRank(item);
		}

		private static bool CheckRank(IUnityItem item) {
			if (item.View.CustomProperties != null && item.View.CustomProperties.ContainsKey("MinimumRank")) {
				var minimumRank = (MemberAccessLevel)Enum.Parse(typeof(MemberAccessLevel), item.View.CustomProperties["MinimumRank"]);

				return PlayerDataManager.AccessLevel >= minimumRank;
			}

			return true;
		}
	}
}
