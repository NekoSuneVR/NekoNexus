using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using UnityEngine;

namespace Paradise.Client {
	internal class ParadisePrefsPanelGUI {
		private static bool showAdvancedSettings;

		private static List<string> WebServiceBaseUrls;
		private static int WebServiceUrlIndex;
		private static string WebServiceEndpoint;
		private static string WebServicePrefix;
		private static string WebServiceSuffix;

		private static List<string> FileServerUrls;
		private static int FileServerUrlIndex;
		private static string ImagePathEndpoint;

		private static string UpdateEndpoint;

		private static bool webServicesDirty;
		private static bool fileServersDirty;
		private static bool updateDirty;

		public static IPopupDialog UpdateDisableConfirmation { get; private set; }

		private static bool HasInvalidWebServerURLs => WebServiceBaseUrls.Find(_ => !Uri.IsWellFormedUriString(_, UriKind.Absolute)) != null;
		private static bool HasInvalidFileServerURLs => FileServerUrls.Find(_ => !Uri.IsWellFormedUriString(_, UriKind.Absolute)) != null;
		public static bool HasInvalidServerURLs => HasInvalidWebServerURLs || HasInvalidFileServerURLs;

		public static void Draw() {
			GUITools.PushGUIState();

			#region General
			ParadiseGUITools.DrawGroup(ParadiseLocalizedStrings.SettingsGeneral, delegate {
				// Allow Telemetry
				var allowTelemetry = GUILayout.Toggle(ParadiseClient.Settings.AllowTelemetry, ParadiseLocalizedStrings.SettingsTelemetry, BlueStonez.toggle);

				if (allowTelemetry != ParadiseClient.Settings.AllowTelemetry) {
					ParadiseClient.Settings.Telemetry = allowTelemetry ? ParadisePrefs.TelemetryChoice.Yes : ParadisePrefs.TelemetryChoice.No;
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Discord Rich Presence
				var enableDiscordRPC = GUILayout.Toggle(ParadiseClient.Settings.EnableDiscordRichPresence, ParadiseLocalizedStrings.SettingsDiscord, BlueStonez.toggle);

				if (enableDiscordRPC != ParadiseClient.Settings.EnableDiscordRichPresence) {
					ParadiseClient.Settings.EnableDiscordRichPresence = enableDiscordRPC;
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Show detailed item statistics in the shop
				var showDetailedItemStatistics = GUILayout.Toggle(ParadiseClient.Settings.ShowDetailedItemStatistics, ParadiseLocalizedStrings.SettingsDetailedItemStatistics, BlueStonez.toggle);

				if (showDetailedItemStatistics != ParadiseClient.Settings.ShowDetailedItemStatistics) {
					ParadiseClient.Settings.ShowDetailedItemStatistics = showDetailedItemStatistics;
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Show weapon names in killfeed
				var showKilledByWeapon = GUILayout.Toggle(ParadiseClient.Settings.ShowWeaponInKillfeed, ParadiseLocalizedStrings.SettingsWeaponsInKillfeed, BlueStonez.toggle);

				if (showKilledByWeapon != ParadiseClient.Settings.ShowWeaponInKillfeed) {
					ParadiseClient.Settings.ShowWeaponInKillfeed = showKilledByWeapon;
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Enable landing grunt
				var enableLandingGrunt = GUILayout.Toggle(ParadiseClient.Settings.EnableLandingGrunt, ParadiseLocalizedStrings.SettingsLandingGrunt, BlueStonez.toggle);

				if (enableLandingGrunt != ParadiseClient.Settings.EnableLandingGrunt) {
					ParadiseClient.Settings.EnableLandingGrunt = enableLandingGrunt;
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				GUI.contentColor = ColorScheme.UberStrikeYellow;
				GUILayout.Label(ParadiseLocalizedStrings.SettingsRestartInfo, BlueStonez.label_interparkbold_11pt_left);
				GUI.contentColor = Color.white;

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Advanced Settings
				showAdvancedSettings = GUILayout.Toggle(showAdvancedSettings, ParadiseLocalizedStrings.SettingsAdvanced, BlueStonez.toggle);

				if (showAdvancedSettings) {
					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					GUI.contentColor = Color.red;
					GUILayout.Label(ParadiseLocalizedStrings.SettingsAdvancedDisclaimer, BlueStonez.label_interparkbold_11pt_left);
					GUI.contentColor = Color.white;
				}
			});
			#endregion

			GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

			#region Main Menu music
			ParadiseGUITools.DrawGroup(ParadiseLocalizedStrings.SettingsMenuTheme, delegate {
				var mainMenuMusic = (ParadisePrefs.MainMenuMusicType)GUILayout.SelectionGrid((int)ParadiseClient.Settings.MainMenuMusic, ParadiseLocalizedStrings.SettingsMenuThemeOptions, 1, BlueStonez.radiobutton);

				if (mainMenuMusic != ParadiseClient.Settings.MainMenuMusic) {
					ParadiseClient.Settings.MainMenuMusic = mainMenuMusic;

					AutoMonoBehaviour<BackgroundMusicPlayer>.Instance.Stop();

					var clip = ParadiseMainMenuMusicManager.GetClip(mainMenuMusic);
					if (clip != null) {
						AutoMonoBehaviour<BackgroundMusicPlayer>.Instance.Play(clip);
					}
				}
			});
			#endregion

			GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

			#region Web Service Settings
			ParadiseGUITools.DrawGroup(ParadiseLocalizedStrings.SettingsServers, delegate {
				// Web Services
				GUILayout.BeginHorizontal();

				GUILayout.Label(ParadiseLocalizedStrings.SettingsWebServices, BlueStonez.label_interparkbold_11pt_left);

				GUILayout.FlexibleSpace();

				if (GUILayout.Button(ParadiseLocalizedStrings.Add, BlueStonez.buttondark_small, GUILayout.Width(36f), GUILayout.Height(20f))) {
					WebServiceBaseUrls.Add(string.Empty);
					webServicesDirty = true;
				};

				GUILayout.Space(ParadiseGUITools.LIST_ITEM_SPACING);

				GUI.enabled = webServicesDirty && !HasInvalidWebServerURLs;
				if (GUILayout.Button(ParadiseLocalizedStrings.Save, BlueStonez.buttondark_small, GUILayout.Width(40f), GUILayout.Height(20f))) {
					SaveWebServiceSettings();
				}
				GUI.enabled = true;

				GUILayout.EndHorizontal();

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				foreach (var item in WebServiceBaseUrls.ToList().Select((x, i) => new { Value = x, Index = i })) {
					var isSelectedServer = item.Index == WebServiceUrlIndex;
					var isValidUrl = Uri.IsWellFormedUriString(item.Value, UriKind.Absolute);

					if (item.Index > 0)
						GUILayout.Space(ParadiseGUITools.LIST_ITEM_SPACING);

					GUILayout.BeginHorizontal();

					GUI.enabled = isValidUrl;
					var selectedServer = GUILayout.Toggle(isSelectedServer, string.Empty, BlueStonez.radiobutton, GUILayout.Width(16f), GUILayout.Height(22f));
					if (selectedServer && selectedServer != isSelectedServer) {
						WebServiceUrlIndex = item.Index;
						webServicesDirty = true;
					}
					GUI.enabled = true;

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_H);

					if (!isValidUrl) {
						GUI.contentColor = Color.red;
					}

					var value = GUILayout.TextField(item.Value, BlueStonez.textField, GUILayout.ExpandWidth(true), GUILayout.Height(22f));
					GUI.contentColor = Color.white;

					if (value != item.Value) {
						WebServiceBaseUrls[item.Index] = value;
						webServicesDirty = true;
					}

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_H);

					GUI.enabled = item.Index != WebServiceUrlIndex;
					if (GUILayout.Button("x", BlueStonez.buttondark_small, GUILayout.Width(22f), GUILayout.Height(22f))) {
						WebServiceBaseUrls.RemoveAt(item.Index);
						webServicesDirty = true;

						if (WebServiceUrlIndex > item.Index) {
							WebServiceUrlIndex--;
						}
					}
					GUI.enabled = true;

					GUILayout.EndHorizontal();
				}

				if (showAdvancedSettings) {
					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					var serviceEndpoint = WebServiceEndpoint;
					ParadiseGUITools.DrawTextField(ParadiseLocalizedStrings.SettingsWebServiceEndpoint, ref serviceEndpoint);

					if (serviceEndpoint != WebServiceEndpoint) {
						WebServiceEndpoint = serviceEndpoint;
						webServicesDirty = true;
					}

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					var servicePrefix = WebServicePrefix;
					ParadiseGUITools.DrawTextField(ParadiseLocalizedStrings.SettingsWebServicePrefix, ref servicePrefix);

					if (servicePrefix != WebServicePrefix) {
						WebServicePrefix = servicePrefix;
						webServicesDirty = true;
					}

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					var serviceSuffix = WebServiceSuffix;
					ParadiseGUITools.DrawTextField(ParadiseLocalizedStrings.SettingsWebServiceSuffix, ref serviceSuffix);

					if (serviceSuffix != WebServiceSuffix) {
						WebServiceSuffix = serviceSuffix;
						webServicesDirty = true;
					}

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					var encryptWSTraffic = GUILayout.Toggle(ParadiseClient.Settings.EncryptWebServiceTraffic, ParadiseLocalizedStrings.SettingsEncryptWSTraffic, BlueStonez.toggle);

					if (encryptWSTraffic != ParadiseClient.Settings.EncryptWebServiceTraffic) {
						ParadiseClient.Settings.EncryptWebServiceTraffic = encryptWSTraffic;
					}
				}

				GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

				// File Servers
				GUILayout.BeginHorizontal();

				GUILayout.Label(ParadiseLocalizedStrings.SettingsFileServers, BlueStonez.label_interparkbold_11pt_left);

				GUILayout.FlexibleSpace();

				if (GUILayout.Button(ParadiseLocalizedStrings.Add, BlueStonez.buttondark_small, GUILayout.Width(36f), GUILayout.Height(20f))) {
					FileServerUrls.Add(string.Empty);
					fileServersDirty = true;
				};

				GUILayout.Space(ParadiseGUITools.LIST_ITEM_SPACING);

				GUI.enabled = fileServersDirty && !HasInvalidFileServerURLs;
				if (GUILayout.Button(ParadiseLocalizedStrings.Save, BlueStonez.buttondark_small, GUILayout.Width(40f), GUILayout.Height(20f))) {
					SaveFileServerSettings();
				}
				GUI.enabled = true;

				GUILayout.EndHorizontal();

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				foreach (var item in FileServerUrls.ToList().Select((x, i) => new { Value = x, Index = i })) {
					var isSelectedServer = item.Index == FileServerUrlIndex;
					var isValidUrl = Uri.IsWellFormedUriString(item.Value, UriKind.Absolute);

					if (item.Index > 0)
						GUILayout.Space(ParadiseGUITools.LIST_ITEM_SPACING);

					GUILayout.BeginHorizontal();

					GUI.enabled = isValidUrl;
					var selectedServer = GUILayout.Toggle(isSelectedServer, string.Empty, BlueStonez.radiobutton, GUILayout.Width(16f), GUILayout.Height(22f));
					if (selectedServer && selectedServer != isSelectedServer) {
						FileServerUrlIndex = item.Index;
						fileServersDirty = true;
					}
					GUI.enabled = true;

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_H);

					if (!isValidUrl) {
						GUI.contentColor = Color.red;
					}

					var value = GUILayout.TextField(item.Value, BlueStonez.textField, GUILayout.ExpandWidth(true), GUILayout.Height(22f));
					GUI.contentColor = Color.white;

					if (value != item.Value) {
						FileServerUrls[item.Index] = value;
						fileServersDirty = true;
					}

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_H);

					GUI.enabled = item.Index != FileServerUrlIndex;
					if (GUILayout.Button("x", BlueStonez.buttondark_small, GUILayout.Width(22f), GUILayout.Height(22f))) {
						FileServerUrls.RemoveAt(item.Index);
						fileServersDirty = true;

						if (FileServerUrlIndex > item.Index) {
							FileServerUrlIndex--;
						}
					}
					GUI.enabled = true;

					GUILayout.EndHorizontal();
				}

				if (showAdvancedSettings) {
					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					var imagePathEndpoint = ImagePathEndpoint;

					ParadiseGUITools.DrawTextField(ParadiseLocalizedStrings.SettingsImagePath, ref imagePathEndpoint);

					if (imagePathEndpoint != ImagePathEndpoint) {
						ImagePathEndpoint = imagePathEndpoint;
						fileServersDirty = true;
					}
				}
			});
			#endregion

			GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

			#region Update Settings
			ParadiseGUITools.DrawGroup(ParadiseLocalizedStrings.SettingsUpdates, delegate {
				// Update Toggle
				var enableUpdates = GUILayout.Toggle(ParadiseClient.Settings.AutoUpdates, ParadiseLocalizedStrings.SettingsEnableUpdates, BlueStonez.toggle);

				if (enableUpdates != ParadiseClient.Settings.AutoUpdates) {
					if (!enableUpdates) {
						UpdateDisableConfirmation = PopupSystem.ShowMessage(ParadiseLocalizedStrings.SettingsDisableUpdates, ParadiseLocalizedStrings.SettingsDisableUpdatesConfirmation, PopupSystem.AlertType.OKCancel, delegate {
							ParadiseClient.Settings.AutoUpdates = enableUpdates;
							UpdateDisableConfirmation = null;
						}, ParadiseLocalizedStrings.Yes, delegate {
							UpdateDisableConfirmation = null;
						}, ParadiseLocalizedStrings.No);
					} else {
						ParadiseClient.Settings.AutoUpdates = enableUpdates;
					}
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				GUITools.PushGUIState();
				GUI.enabled = ParadiseClient.Settings.AutoUpdates;

				// Update Channel
				var updateChannel = (int)ParadiseClient.Settings.UpdateChannel;
				ParadiseGUITools.DrawToolbar(ParadiseLocalizedStrings.SettingsUpdateChannel, ref updateChannel, ParadiseLocalizedStrings.SettingUpdateChannelOptions);

				if (updateChannel != (int)ParadiseClient.Settings.UpdateChannel) {
					ParadiseClient.Settings.UpdateChannel = (UpdateChannel)updateChannel;
				}

				GUI.enabled = true;

				if (showAdvancedSettings) {

					GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();

					GUI.enabled = fileServersDirty && !HasInvalidFileServerURLs;
					if (GUILayout.Button(ParadiseLocalizedStrings.Save, BlueStonez.buttondark_small, GUILayout.Width(40f), GUILayout.Height(20f))) {
						SaveFileServerSettings();
					}
					GUI.enabled = true;

					GUILayout.EndHorizontal();

					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					var updateEndpoint = UpdateEndpoint;
					ParadiseGUITools.DrawTextField(ParadiseLocalizedStrings.SettingsUpdateEndpoint, ref updateEndpoint);

					if (updateEndpoint != UpdateEndpoint) {
						UpdateEndpoint = updateEndpoint;
						updateDirty = true;
					}
				}

				GUITools.PopGUIState();
			});
			#endregion

			GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

			GUILayout.Label($"Version {Assembly.GetExecutingAssembly().GetName().Version}", BlueStonez.label_interparkbold_11pt);
			GUILayout.Space(4f);
			GUILayout.Label(FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).LegalCopyright.Replace("\u00a9", "(c)"), BlueStonez.label_interparkbold_11pt);

			GUITools.PopGUIState();
		}

		public static void ReloadSettings() {
			// We're bypassing the regular ParadisePrefs instance in order
			// to keep the web services as-is for the current game session
			WebServiceBaseUrls = ParadiseClient.Settings.GetKey<List<string>>(ParadisePrefs.Key.WebServiceBaseUrls);
			WebServiceUrlIndex = ParadiseClient.Settings.GetKey<int>(ParadisePrefs.Key.WebServiceUrlIndex);
			WebServiceEndpoint = ParadiseClient.Settings.GetKey<string>(ParadisePrefs.Key.WebServiceEndpoint);
			WebServicePrefix = ParadiseClient.Settings.GetKey<string>(ParadisePrefs.Key.WebServicePrefix);
			WebServiceSuffix = ParadiseClient.Settings.GetKey<string>(ParadisePrefs.Key.WebServiceSuffix);

			FileServerUrls = ParadiseClient.Settings.GetKey<List<string>>(ParadisePrefs.Key.FileServerUrls);
			FileServerUrlIndex = ParadiseClient.Settings.GetKey<int>(ParadisePrefs.Key.FileServerUrlIndex);
			ImagePathEndpoint = ParadiseClient.Settings.GetKey<string>(ParadisePrefs.Key.ImagePathEndpoint);

			UpdateEndpoint = ParadiseClient.Settings.GetKey<string>(ParadisePrefs.Key.UpdateEndpoint);
		}

		public static void SaveSettings() {
			SaveWebServiceSettings();
			SaveFileServerSettings();
			SaveUpdateSettings();
		}

		private static void SaveWebServiceSettings() {
			if (webServicesDirty) {
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.WebServiceBaseUrls, WebServiceBaseUrls);
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.WebServiceUrlIndex, WebServiceUrlIndex);
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.WebServiceEndpoint, WebServiceEndpoint);
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.WebServiceSuffix, WebServiceSuffix);
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.WebServicePrefix, WebServicePrefix);
			}

			webServicesDirty = false;
		}

		private static void SaveFileServerSettings() {
			if (fileServersDirty) {
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.FileServerUrls, FileServerUrls);
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.FileServerUrlIndex, FileServerUrlIndex);
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.ImagePathEndpoint, ImagePathEndpoint);
			}

			fileServersDirty = false;
		}

		private static void SaveUpdateSettings() {
			if (updateDirty) {
				ParadiseClient.Settings.SetKey(ParadisePrefs.Key.UpdateEndpoint, UpdateEndpoint);
			}

			updateDirty = false;
		}
	}
}
