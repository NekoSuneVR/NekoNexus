using HarmonyLib;
using System;
using UnityEngine;

namespace NekoNexus.Client {
	[HarmonyPatch(typeof(ApplicationDataManager))]
	public static class ApplicationDataManagerHook {
		public static GameObject PluginHolder;

		[HarmonyPatch(MethodType.StaticConstructor), HarmonyPostfix, HarmonyPrepare]
		public static void ctor_Postfix() {
			PluginHolder = new GameObject("Plugin Holder");
			PluginHolder.AddComponent<NekoNexusApplicationManager>();

			UnityEngine.Object.DontDestroyOnLoad(PluginHolder);

			var webServiceUri = new UriBuilder(NekoNexusClient.Settings.WebServiceBaseUrl) {
				Path = NekoNexusClient.Settings.WebServiceEndpoint
			}.ToString();

			var imagePathUri = new UriBuilder(NekoNexusClient.Settings.FileServerUrl) {
				Path = NekoNexusClient.Settings.ImagePathEndpoint
			}.ToString();

			var traverse = NekoNexusTraverse.Create(typeof(ApplicationDataManager));

			traverse.SetField("WebServiceBaseUrl", ForceTrailingSlash(webServiceUri));
			traverse.SetField("ImagePath", ForceTrailingSlash(imagePathUri));
		}

		private static string ForceTrailingSlash(string uri) {
			return uri.EndsWith("/") ? uri : uri + "/";
		}
	}
}
