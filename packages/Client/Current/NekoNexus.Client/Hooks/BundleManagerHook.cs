using HarmonyLib;
using UnityEngine;

namespace NekoNexus.Client {
	/// <summary>
	/// Allows purchasing ingame bundles for free without Steam microtransactions.
	/// </summary>
	[HarmonyPatch(typeof(BundleManager))]
	public static class BundleManagerHook {
		private static NekoNexusTraverse<BundleManager> traverse;

		[HarmonyPatch("BuyBundle"), HarmonyPrefix]
		public static bool BuyBundle_Prefix(BundleManager __instance, BundleUnityView bundle) {
			if (traverse == null) {
				traverse = NekoNexusTraverse<BundleManager>.Create(__instance);
			}

			return true;
		}

		[HarmonyPatch("<BuyBundle>m__A7"), HarmonyPrefix]
		public static bool BuyBundle_m__A7_Prefix(bool success) {
			traverse.InvokeMethod("OnMicroTxnCallback", new object[] {
				new Steamworks.MicroTxnAuthorizationResponse_t {
					m_bAuthorized = (byte)(success ? 1 : 0)
				}
			});

			return false;
		}
	}
}
