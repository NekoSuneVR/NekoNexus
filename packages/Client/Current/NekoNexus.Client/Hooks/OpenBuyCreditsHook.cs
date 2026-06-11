using System;
using HarmonyLib;
using UnityEngine;

namespace NekoNexus.Client {
	/// <summary>
	/// The original "Get Credits" button opens the in-game credit-bundle page. On a NekoNexus
	/// server that page's IMGUI rendering throws every frame (no Steam micro-transaction bundles),
	/// which freezes the whole UI ("unclickable"). Instead, open the NekoNexus web store in the
	/// browser - a NekoPay-powered page where players buy credits / donate. The NekoPay webhook
	/// then grants the credits in-game.
	/// </summary>
	[HarmonyPatch(typeof(ApplicationDataManager), "OpenBuyCredits")]
	public static class OpenBuyCreditsHook {
		private static readonly log4net.ILog Log = log4net.LogManager.GetLogger(nameof(OpenBuyCreditsHook));

		public static bool Prefix() {
			try {
				// WebServiceBaseUrl is the authority the client is pointed at (e.g. https://your.domain).
				// The store lives at /store on the same host (proxy /store -> admin dashboard).
				var baseUrl = NekoNexusClient.Settings.WebServiceBaseUrl;
				if (!string.IsNullOrEmpty(baseUrl)) {
					baseUrl = baseUrl.TrimEnd('/');
					var url = string.Format("{0}/store?cmid={1}", baseUrl, PlayerDataManager.Cmid);
					Log.Info("Opening NekoNexus web store: " + url);
					Application.OpenURL(url);
				}
			} catch (Exception e) {
				Log.Error("Failed to open the NekoNexus web store", e);
			}

			// Skip the original (crashing) credit-bundle page entirely.
			return false;
		}
	}
}
