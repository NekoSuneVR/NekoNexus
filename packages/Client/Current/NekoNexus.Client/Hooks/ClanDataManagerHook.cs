using Cmune.DataCenter.Common.Entities;
using HarmonyLib;

namespace NekoNexus.Client {
	/// <summary>
	/// Disables client-side clan requirements for Admins.
	/// </summary>
	[HarmonyPatch(typeof(ClanDataManager))]
	public static class ClanDataManagerHook {
		[HarmonyPatch("get_HaveFriends"), HarmonyPostfix]
		public static void get_HaveFriends_Postfix(ref bool __result) {
			if (PlayerDataManager.AccessLevel == MemberAccessLevel.Admin) {
				__result = true;
			}
		}

		[HarmonyPatch("get_HaveLevel"), HarmonyPostfix]
		public static void get_HaveLevel_Postfix(ref bool __result) {
			if (PlayerDataManager.AccessLevel == MemberAccessLevel.Admin) {
				__result = true;
			}
		}

		[HarmonyPatch("get_HaveLicense"), HarmonyPostfix]
		public static void get_HaveLicense_Postfix(ref bool __result) {
			if (PlayerDataManager.AccessLevel == MemberAccessLevel.Admin) {
				__result = true;
			}
		}
	}
}
