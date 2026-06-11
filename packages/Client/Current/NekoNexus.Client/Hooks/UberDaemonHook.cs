using HarmonyLib;
using System.Diagnostics;
using UnityEngine;

namespace NekoNexus.Client {
	[HarmonyPatch(typeof(UberDaemon))]
	public static class UberDaemonHook {
		[HarmonyPatch("GetMagicHash"), HarmonyPrefix]
		public static bool GetMagicHash_Prefix() {
			return false;
		}

		[HarmonyPatch("GetMagicHash"), HarmonyPostfix]
		public static void GetMagicHash_Postfix(string authToken, ref string __result) {
			var processStartInfo = new ProcessStartInfo {
				RedirectStandardError = true,
				RedirectStandardOutput = true,
				UseShellExecute = false,
				WindowStyle = ProcessWindowStyle.Minimized,
				CreateNoWindow = true
			};

			if (Application.platform == RuntimePlatform.WindowsPlayer) {
				processStartInfo.FileName = "uberdaemon_nekonexus.exe";
				processStartInfo.Arguments = authToken;
			} else {
				processStartInfo.FileName = "/usr/bin/bash";
				processStartInfo.Arguments = $"uberdaemon_nekonexus.sh {authToken}";
			}

			try {
				var process = Process.Start(processStartInfo);
				__result = process.StandardOutput.ReadToEnd().Trim();
			} catch {
				// uberdaemon helper not present. The magic hash is only checked by servers with
				// EnableHashVerification on; fall back to empty so authentication still proceeds.
				__result = string.Empty;
			}
		}
	}
}
