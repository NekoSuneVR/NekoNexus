using HarmonyLib;
using System;
using UnityEngine;

namespace Paradise.Client {
	[HarmonyPatch(typeof(ApplicationDataManager))]
	public static class ApplicationDataManagerHook {
		public static GameObject PluginHolder;

		[HarmonyPatch(MethodType.StaticConstructor), HarmonyPostfix, HarmonyPrepare]
		public static void ctor_Postfix() {
			PluginHolder = new GameObject("Plugin Holder");
			PluginHolder.AddComponent<ParadiseApplicationManager>();

			UnityEngine.Object.DontDestroyOnLoad(PluginHolder);

			var webServiceUri = new UriBuilder(ParadiseClient.Settings.WebServiceBaseUrl) {
				Path = ParadiseClient.Settings.WebServiceEndpoint
			}.ToString();

			var imagePathUri = new UriBuilder(ParadiseClient.Settings.FileServerUrl) {
				Path = ParadiseClient.Settings.ImagePathEndpoint
			}.ToString();

			var traverse = ParadiseTraverse.Create(typeof(ApplicationDataManager));

			traverse.SetField("WebServiceBaseUrl", ForceTrailingSlash(webServiceUri));
			traverse.SetField("ImagePath", ForceTrailingSlash(imagePathUri));
		}

		private static string ForceTrailingSlash(string uri) {
			return uri.EndsWith("/") ? uri : uri + "/";
		}
	}
}
