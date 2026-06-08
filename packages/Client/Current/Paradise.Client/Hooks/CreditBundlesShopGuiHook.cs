using HarmonyLib;
using UnityEngine;

namespace Paradise.Client {
	/// <summary>
	/// The native in-game credit-bundle page (the shop's "Credits" tab AND the Get Credits button)
	/// renders Steam micro-transaction bundles that don't exist on a Paradise server, which throws
	/// every frame and freezes the UI ("unclickable"). Replace its drawing with a simple panel that
	/// opens the Paradise web store (NekoPay) in the browser.
	/// </summary>
	[HarmonyPatch(typeof(CreditBundlesShopGui), "Draw")]
	public static class CreditBundlesShopGuiHook {
		public static bool Prefix(Rect position) {
			GUI.Label(
				new Rect(position.x + 8f, position.y + 12f, position.width - 16f, 24f),
				"Get credits on the Paradise web store",
				BlueStonez.label_interparkbold_16pt);

			GUI.Label(
				new Rect(position.x + 8f, position.y + 40f, position.width - 16f, 40f),
				"Opens in your browser. Credits are added to your account after payment, and appear " +
				"in-game on your next login or wallet refresh.",
				BlueStonez.label_interparkbold_11pt_left);

			if (GUI.Button(new Rect(position.x + 8f, position.y + 88f, 180f, 32f), "Open Web Store", BlueStonez.button_green)) {
				GUITools.Clicked();
				ApplicationDataManager.OpenBuyCredits();
			}

			// Skip the original (crashing) bundle rendering.
			return false;
		}
	}
}
