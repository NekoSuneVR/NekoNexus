using HarmonyLib;
using log4net;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using UberStrike.Core.Models;
using UnityEngine;

namespace NekoNexus.Client {
	[HarmonyPatch(typeof(MenuPageManager))]
	public static class MenuPageManagerHook {
		private static readonly ILog Log = LogManager.GetLogger(nameof(MenuPageManagerHook));

		private static bool HasHandledCmdLineArgs;
		private static bool HasSubmittedMachineData;

		[HarmonyPatch("LoadPage"), HarmonyPrefix]
		public static bool LoadPage_Prefix(MenuPageManager __instance, PageType pageType, bool forceReload = false) {
			AutoMonoBehaviour<PreloadOptionsPanelButton>.Instance.enabled = false;

			if (pageType == PageType.Home) {
				AutoMonoBehaviour<BackgroundMusicPlayer>.Instance.Stop();

				var menuClip = NekoNexusMainMenuMusicManager.GetClip(NekoNexusClient.Settings.MainMenuMusic);
				if (menuClip != null) {
					AutoMonoBehaviour<BackgroundMusicPlayer>.Instance.Play(menuClip);
				}

				if (!HasSubmittedMachineData && NekoNexusClient.Settings.AllowTelemetry) {
					HasSubmittedMachineData = true;
					NekoNexusWebServiceClient.RecordPlayerMachineData();
				}

				if (!HasHandledCmdLineArgs) {
					HasHandledCmdLineArgs = true;

					var args = Environment.GetCommandLineArgs();
					if (args.Length > 1) {
						if (Uri.TryCreate(args[1], UriKind.Absolute, out var uri) && uri.Scheme.Equals("uberstrike")) {
							using (var menuTimer = new Timer(menuTimerState => {
								switch (uri.Host.ToLower()) {
									case "connect":
										var _args = uri.AbsolutePath.Substring(1).Split('/');
										UnityRuntime.StartRoutine(ConnectToServer(_args));
										//Log.Info(_args);
										//var gameServers = Traverse.Create(Singleton<GameServerManager>.Instance).Field<Dictionary<int, PhotonServer>>("_gameServers").Value;
										//Log.Info(gameServers);

										//var photonServer = gameServers.Values.ToList().Find(_ => _.ConnectionString.Equals(_args[0], StringComparison.InvariantCulture));
										//Log.Info(photonServer);

										//if (photonServer != null) {
										//	Singleton<GameServerController>.Instance.SelectedServer = photonServer;
										//	Singleton<GameStateController>.Instance.Client.EnterGameLobby(photonServer.ConnectionString);
										//} else {
										//	PopupSystem.ShowMessage("Connection Error", "Could not connect to server.");
										//	break;
										//}

										//Log.Info($"selected1: {Singleton<GameServerController>.Instance.SelectedServer}");
										//using (var photonConnectTimer = new Timer(photonConnectState => {
										//	Log.Info($"selected2: {Singleton<GameServerController>.Instance.SelectedServer}");
										//	if (Singleton<GameServerController>.Instance.SelectedServer != null) {
										//		var gameList = Traverse.Create(Singleton<GameListManager>.Instance).Field<Dictionary<int, GameRoomData>>("_gameList").Value;
										//		Log.Info(gameList);

										//		var gameServer = gameList.Values.ToList().Find(_ => _.Number == int.Parse(_args[1]));
										//		Log.Info(gameServer);

										//		if (gameServer != null) {
										//			Singleton<GameStateController>.Instance.JoinNetworkGame(gameServer);
										//		} else {
										//			PopupSystem.ShowMessage("Connection Error", "Could not connect to specified room.");
										//		}
										//	}
										//}, null, 200, Timeout.Infinite)) { }

										break;
									case "open":
										var page = uri.Segments[1];

										switch (page) {
											case "play":
												GameData.Instance.MainMenu.Value = MainMenuState.None;
												__instance.LoadPage(PageType.Play);

												break;
											case "stats":
												GameData.Instance.MainMenu.Value = MainMenuState.None;
												__instance.LoadPage(PageType.Stats);

												break;
											case "shop":
												GameData.Instance.MainMenu.Value = MainMenuState.None;
												__instance.LoadPage(PageType.Shop);

												break;
											case "inbox":
												GameData.Instance.MainMenu.Value = MainMenuState.None;
												__instance.LoadPage(PageType.Inbox);

												break;
											case "clans":
												GameData.Instance.MainMenu.Value = MainMenuState.None;
												__instance.LoadPage(PageType.Clans);

												break;
											case "training":
												GameData.Instance.MainMenu.Value = MainMenuState.None;
												__instance.LoadPage(PageType.Training);

												break;
											case "chat":
												GameData.Instance.MainMenu.Value = MainMenuState.None;
												__instance.LoadPage(PageType.Chat);

												break;
										}

										break;
									default:
										break;
								}
							}, null, 0, Timeout.Infinite)) { }
						}
					}
				}

				// NOTE: update check intentionally NOT run here. Updates are only checked once at
				// launch (GlobalSceneLoaderHook -> StartWithCheckingUpdates) so the "Update available"
				// popup can't keep reappearing every time the player returns to the Home menu in-game.
			}

			return true;
		}

		private static IEnumerator ConnectToServer(string[] args) {
			var dialog = PopupSystem.ShowProgress("Authentication", "Connecting to Server", () => 0);

			var gameServers = Traverse.Create(Singleton<GameServerManager>.Instance).Field<Dictionary<int, PhotonServer>>("_gameServers").Value;
			var photonServer = gameServers.Values.ToList().Find(_ => _.ConnectionString.Equals(args[0], StringComparison.InvariantCulture));

			if (photonServer != null) {
				Singleton<GameServerController>.Instance.SelectedServer = photonServer;
				Singleton<GameStateController>.Instance.Client.EnterGameLobby(photonServer.ConnectionString);
			} else {
				PopupSystem.HideMessage(dialog);
				PopupSystem.ShowMessage("Connection Error", "Could not connect to server.");
				yield break;
			}

			yield return new WaitForSeconds(0.5f);

			if (Singleton<GameServerController>.Instance.SelectedServer != null) {
				var gameList = Traverse.Create(Singleton<GameListManager>.Instance).Field<Dictionary<int, GameRoomData>>("_gameList").Value;

				var gameRoom = gameList.Values.ToList().Find(_ => _.Number == int.Parse(args[1]));

				PopupSystem.HideMessage(dialog);
				if (gameRoom != null) {
					Singleton<GameStateController>.Instance.JoinNetworkGame(gameRoom);
				} else {
					PopupSystem.ShowMessage("Connection Error", "Could not connect to specified room.");
				}
			}

			yield break;
		}
	}
}
