using Cmune.DataCenter.Common.Entities;
using HarmonyLib;
using System.Collections;
using UberStrike.DataCenter.Common.Entities;
using UnityEngine;

namespace NekoNexus.Client {
	/// <summary>
	/// Reduces the wait time for connecting to the lobby chat after the main menu has loaded
	/// </summary>
	[HarmonyPatch(typeof(CommConnectionManager))]
	public static class CommConnectionManagerHook {

		[HarmonyPatch("Awake"), HarmonyPrefix]
		public static bool Awake_Prefix(CommConnectionManager __instance) {
			NekoNexusTraverse.SetProperty(__instance, "Client", new CommPeer());
			EventHandler.Global.AddListener(delegate (GlobalEvents.Login ev) { NekoNexusTraverse.InvokeMethod(__instance, "OnLoginEvent", ev); });

			return false;
		}

		public static void Connect(CommConnectionManager __instance) {
			__instance.Client?.Disconnect();

			NekoNexusTraverse.SetProperty(__instance, "Client", new CommPeer());
			__instance.StartCoroutine(NekoNexusTraverse.InvokeMethod<IEnumerator>(__instance, "StartCheckingCommServerConnection"));
		}

		[HarmonyPatch("StartCheckingCommServerConnection"), HarmonyPrefix]
		public static bool StartCheckingCommServerConnection_Prefix() {
			return false;
		}

#pragma warning disable CS0162
		[HarmonyPatch("StartCheckingCommServerConnection"), HarmonyPostfix]
		public static IEnumerator StartCheckingCommServerConnection_Postfix(IEnumerator value, CommConnectionManager __instance) {
			var client = new Traverse(__instance).Property<CommPeer>("Client").Value;

			for (; ; ) {
				if (client.IsEnabled && !client.IsConnected && Singleton<GameServerManager>.Instance.CommServer.IsValid && PlayerDataManager.IsPlayerLoggedIn) {
					client.Connect(Singleton<GameServerManager>.Instance.CommServer.ConnectionString);
				}

				yield return new WaitForSeconds(5f);
			}

			yield break;
		}
#pragma warning restore CS0162

		[HarmonyPatch(typeof(CompleteAccountPanelGUI), "CompleteAccountCallback"), HarmonyPrefix]
		public static bool CompleteAccountPanelGUI_CompleteAccountCallback_Prefix(CompleteAccountPanelGUI __instance, AccountCompletionResultView result, string name) {
			if (result.Result == AccountCompletionResult.Ok) {
				Connect(AutoMonoBehaviour<CommConnectionManager>.Instance);
			}

			return true;
		}
	}
}
