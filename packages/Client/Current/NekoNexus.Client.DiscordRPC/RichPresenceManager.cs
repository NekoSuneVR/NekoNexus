using DiscordRPC;
using DiscordRPC.Logging;
using System;
using System.IO;
using System.Reflection;

namespace NekoNexus.Client.DiscordRPC {
	internal class RichPresenceManager {
		private static DiscordRpcClient rpcClient;

		// Discord application ("client") ID. Overridable without recompiling: drop a file named
		// "discord-app-id.txt" next to this exe (UberStrike_Data/Plugins) containing just the ID of
		// your own Discord application. Falls back to the built-in ID. Use your own app so the activity
		// shows your name/branding and your uploaded "uberstrike" art asset.
		private const string DefaultAppId = "1071893834172223518";

		private static string ResolveAppId() {
			try {
				var sidecar = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? ".", "discord-app-id.txt");
				if (File.Exists(sidecar)) {
					var id = File.ReadAllText(sidecar).Trim();
					if (!string.IsNullOrEmpty(id)) return id;
				}
			} catch { }
			return DefaultAppId;
		}

		public static void Initialize() {
			var appId = ResolveAppId();
			Program.Log($"Initializing DiscordRPC for application \"{appId}\"");

			rpcClient = new DiscordRpcClient(appId) {
				Logger = new ConsoleLogger() { Level = LogLevel.Warning }
			};

			rpcClient.OnReady += (sender, e) => {
				Program.Log($"Received Ready from user {e.User.Username}");
			};

			rpcClient.OnPresenceUpdate += (sender, e) => {
				Program.Log($"Received Update! {e.Presence}");
			};

			rpcClient.Initialize();
		}

		public static void SetPresence(RichPresenceSerializable presence) {
			try {
				if (presence.ClearPresence) {
					rpcClient.ClearPresence();
				} else {
					rpcClient.SetPresence(RichPresenceSerializable.Deserialize(presence));
				}
			} catch (Exception e) {
				Program.Log($"Failed to set presence: {e}");
			}
		}
	}
}
