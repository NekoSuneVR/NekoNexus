using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using UnityEngine;

namespace NekoNexus.Client {
	internal class NekoNexusPrefsPanelGUI {
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
			NekoNexusGUITools.DrawGroup(NekoNexusLocalizedStrings.SettingsGeneral, delegate {
				// Allow Telemetry
				var allowTelemetry = GUILayout.Toggle(NekoNexusClient.Settings.AllowTelemetry, NekoNexusLocalizedStrings.SettingsTelemetry, BlueStonez.toggle);

				if (allowTelemetry != NekoNexusClient.Settings.AllowTelemetry) {
					NekoNexusClient.Settings.Telemetry = allowTelemetry ? NekoNexusPrefs.TelemetryChoice.Yes : NekoNexusPrefs.TelemetryChoice.No;
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				// Discord Rich Presence
				var enableDiscordRPC = GUILayout.Toggle(NekoNexusClient.Settings.EnableDiscordRichPresence, NekoNexusLocalizedStrings.SettingsDiscord, BlueStonez.toggle);

				if (enableDiscordRPC != NekoNexusClient.Settings.EnableDiscordRichPresence) {
					NekoNexusClient.Settings.EnableDiscordRichPresence = enableDiscordRPC;
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				// Show detailed item statistics in the shop
				var showDetailedItemStatistics = GUILayout.Toggle(NekoNexusClient.Settings.ShowDetailedItemStatistics, NekoNexusLocalizedStrings.SettingsDetailedItemStatistics, BlueStonez.toggle);

				if (showDetailedItemStatistics != NekoNexusClient.Settings.ShowDetailedItemStatistics) {
					NekoNexusClient.Settings.ShowDetailedItemStatistics = showDetailedItemStatistics;
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				// Show weapon names in killfeed
				var showKilledByWeapon = GUILayout.Toggle(NekoNexusClient.Settings.ShowWeaponInKillfeed, NekoNexusLocalizedStrings.SettingsWeaponsInKillfeed, BlueStonez.toggle);

				if (showKilledByWeapon != NekoNexusClient.Settings.ShowWeaponInKillfeed) {
					NekoNexusClient.Settings.ShowWeaponInKillfeed = showKilledByWeapon;
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				// Enable landing grunt
				var enableLandingGrunt = GUILayout.Toggle(NekoNexusClient.Settings.EnableLandingGrunt, NekoNexusLocalizedStrings.SettingsLandingGrunt, BlueStonez.toggle);

				if (enableLandingGrunt != NekoNexusClient.Settings.EnableLandingGrunt) {
					NekoNexusClient.Settings.EnableLandingGrunt = enableLandingGrunt;
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				GUI.contentColor = ColorScheme.UberStrikeYellow;
				GUILayout.Label(NekoNexusLocalizedStrings.SettingsRestartInfo, BlueStonez.label_interparkbold_11pt_left);
				GUI.contentColor = Color.white;

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				// Advanced Settings
				showAdvancedSettings = GUILayout.Toggle(showAdvancedSettings, NekoNexusLocalizedStrings.SettingsAdvanced, BlueStonez.toggle);

				if (showAdvancedSettings) {
					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					GUI.contentColor = Color.red;
					GUILayout.Label(NekoNexusLocalizedStrings.SettingsAdvancedDisclaimer, BlueStonez.label_interparkbold_11pt_left);
					GUI.contentColor = Color.white;
				}
			});
			#endregion

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			#region Main Menu music
			NekoNexusGUITools.DrawGroup(NekoNexusLocalizedStrings.SettingsMenuTheme, delegate {
				var mainMenuMusic = (NekoNexusPrefs.MainMenuMusicType)GUILayout.SelectionGrid((int)NekoNexusClient.Settings.MainMenuMusic, NekoNexusLocalizedStrings.SettingsMenuThemeOptions, 1, BlueStonez.radiobutton);

				if (mainMenuMusic != NekoNexusClient.Settings.MainMenuMusic) {
					NekoNexusClient.Settings.MainMenuMusic = mainMenuMusic;

					AutoMonoBehaviour<BackgroundMusicPlayer>.Instance.Stop();

					var clip = NekoNexusMainMenuMusicManager.GetClip(mainMenuMusic);
					if (clip != null) {
						AutoMonoBehaviour<BackgroundMusicPlayer>.Instance.Play(clip);
					}
				}
			});
			#endregion

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			#region Web Service Settings
			NekoNexusGUITools.DrawGroup(NekoNexusLocalizedStrings.SettingsServers, delegate {
				// Web Services
				GUILayout.BeginHorizontal();

				GUILayout.Label(NekoNexusLocalizedStrings.SettingsWebServices, BlueStonez.label_interparkbold_11pt_left);

				GUILayout.FlexibleSpace();

				if (GUILayout.Button(NekoNexusLocalizedStrings.Add, BlueStonez.buttondark_small, GUILayout.Width(36f), GUILayout.Height(20f))) {
					WebServiceBaseUrls.Add(string.Empty);
					webServicesDirty = true;
				};

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				GUI.enabled = webServicesDirty && !HasInvalidWebServerURLs;
				if (GUILayout.Button(NekoNexusLocalizedStrings.Save, BlueStonez.buttondark_small, GUILayout.Width(40f), GUILayout.Height(20f))) {
					SaveWebServiceSettings();
				}
				GUI.enabled = true;

				GUILayout.EndHorizontal();

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				foreach (var item in WebServiceBaseUrls.ToList().Select((x, i) => new { Value = x, Index = i })) {
					var isSelectedServer = item.Index == WebServiceUrlIndex;
					var isValidUrl = Uri.IsWellFormedUriString(item.Value, UriKind.Absolute);

					if (item.Index > 0)
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

					GUILayout.BeginHorizontal();

					GUI.enabled = isValidUrl;
					var selectedServer = GUILayout.Toggle(isSelectedServer, string.Empty, BlueStonez.radiobutton, GUILayout.Width(16f), GUILayout.Height(22f));
					if (selectedServer && selectedServer != isSelectedServer) {
						WebServiceUrlIndex = item.Index;
						webServicesDirty = true;
					}
					GUI.enabled = true;

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_H);

					if (!isValidUrl) {
						GUI.contentColor = Color.red;
					}

					var value = GUILayout.TextField(item.Value, BlueStonez.textField, GUILayout.ExpandWidth(true), GUILayout.Height(22f));
					GUI.contentColor = Color.white;

					if (value != item.Value) {
						WebServiceBaseUrls[item.Index] = value;
						webServicesDirty = true;
					}

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_H);

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
					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					var serviceEndpoint = WebServiceEndpoint;
					NekoNexusGUITools.DrawTextField(NekoNexusLocalizedStrings.SettingsWebServiceEndpoint, ref serviceEndpoint);

					if (serviceEndpoint != WebServiceEndpoint) {
						WebServiceEndpoint = serviceEndpoint;
						webServicesDirty = true;
					}

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					var servicePrefix = WebServicePrefix;
					NekoNexusGUITools.DrawTextField(NekoNexusLocalizedStrings.SettingsWebServicePrefix, ref servicePrefix);

					if (servicePrefix != WebServicePrefix) {
						WebServicePrefix = servicePrefix;
						webServicesDirty = true;
					}

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					var serviceSuffix = WebServiceSuffix;
					NekoNexusGUITools.DrawTextField(NekoNexusLocalizedStrings.SettingsWebServiceSuffix, ref serviceSuffix);

					if (serviceSuffix != WebServiceSuffix) {
						WebServiceSuffix = serviceSuffix;
						webServicesDirty = true;
					}

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					var encryptWSTraffic = GUILayout.Toggle(NekoNexusClient.Settings.EncryptWebServiceTraffic, NekoNexusLocalizedStrings.SettingsEncryptWSTraffic, BlueStonez.toggle);

					if (encryptWSTraffic != NekoNexusClient.Settings.EncryptWebServiceTraffic) {
						NekoNexusClient.Settings.EncryptWebServiceTraffic = encryptWSTraffic;
					}
				}

				GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

				// File Servers
				GUILayout.BeginHorizontal();

				GUILayout.Label(NekoNexusLocalizedStrings.SettingsFileServers, BlueStonez.label_interparkbold_11pt_left);

				GUILayout.FlexibleSpace();

				if (GUILayout.Button(NekoNexusLocalizedStrings.Add, BlueStonez.buttondark_small, GUILayout.Width(36f), GUILayout.Height(20f))) {
					FileServerUrls.Add(string.Empty);
					fileServersDirty = true;
				};

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				GUI.enabled = fileServersDirty && !HasInvalidFileServerURLs;
				if (GUILayout.Button(NekoNexusLocalizedStrings.Save, BlueStonez.buttondark_small, GUILayout.Width(40f), GUILayout.Height(20f))) {
					SaveFileServerSettings();
				}
				GUI.enabled = true;

				GUILayout.EndHorizontal();

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				foreach (var item in FileServerUrls.ToList().Select((x, i) => new { Value = x, Index = i })) {
					var isSelectedServer = item.Index == FileServerUrlIndex;
					var isValidUrl = Uri.IsWellFormedUriString(item.Value, UriKind.Absolute);

					if (item.Index > 0)
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

					GUILayout.BeginHorizontal();

					GUI.enabled = isValidUrl;
					var selectedServer = GUILayout.Toggle(isSelectedServer, string.Empty, BlueStonez.radiobutton, GUILayout.Width(16f), GUILayout.Height(22f));
					if (selectedServer && selectedServer != isSelectedServer) {
						FileServerUrlIndex = item.Index;
						fileServersDirty = true;
					}
					GUI.enabled = true;

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_H);

					if (!isValidUrl) {
						GUI.contentColor = Color.red;
					}

					var value = GUILayout.TextField(item.Value, BlueStonez.textField, GUILayout.ExpandWidth(true), GUILayout.Height(22f));
					GUI.contentColor = Color.white;

					if (value != item.Value) {
						FileServerUrls[item.Index] = value;
						fileServersDirty = true;
					}

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_H);

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
					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					var imagePathEndpoint = ImagePathEndpoint;

					NekoNexusGUITools.DrawTextField(NekoNexusLocalizedStrings.SettingsImagePath, ref imagePathEndpoint);

					if (imagePathEndpoint != ImagePathEndpoint) {
						ImagePathEndpoint = imagePathEndpoint;
						fileServersDirty = true;
					}
				}
			});
			#endregion

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			#region Update Settings
			NekoNexusGUITools.DrawGroup(NekoNexusLocalizedStrings.SettingsUpdates, delegate {
				// Update Toggle
				var enableUpdates = GUILayout.Toggle(NekoNexusClient.Settings.AutoUpdates, NekoNexusLocalizedStrings.SettingsEnableUpdates, BlueStonez.toggle);

				if (enableUpdates != NekoNexusClient.Settings.AutoUpdates) {
					if (!enableUpdates) {
						UpdateDisableConfirmation = PopupSystem.ShowMessage(NekoNexusLocalizedStrings.SettingsDisableUpdates, NekoNexusLocalizedStrings.SettingsDisableUpdatesConfirmation, PopupSystem.AlertType.OKCancel, delegate {
							NekoNexusClient.Settings.AutoUpdates = enableUpdates;
							UpdateDisableConfirmation = null;
						}, NekoNexusLocalizedStrings.Yes, delegate {
							UpdateDisableConfirmation = null;
						}, NekoNexusLocalizedStrings.No);
					} else {
						NekoNexusClient.Settings.AutoUpdates = enableUpdates;
					}
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				GUITools.PushGUIState();
				GUI.enabled = NekoNexusClient.Settings.AutoUpdates;

				// Update Channel
				var updateChannel = (int)NekoNexusClient.Settings.UpdateChannel;
				NekoNexusGUITools.DrawToolbar(NekoNexusLocalizedStrings.SettingsUpdateChannel, ref updateChannel, NekoNexusLocalizedStrings.SettingUpdateChannelOptions);

				if (updateChannel != (int)NekoNexusClient.Settings.UpdateChannel) {
					NekoNexusClient.Settings.UpdateChannel = (UpdateChannel)updateChannel;
				}

				GUI.enabled = true;

				if (showAdvancedSettings) {

					GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();

					GUI.enabled = fileServersDirty && !HasInvalidFileServerURLs;
					if (GUILayout.Button(NekoNexusLocalizedStrings.Save, BlueStonez.buttondark_small, GUILayout.Width(40f), GUILayout.Height(20f))) {
						SaveFileServerSettings();
					}
					GUI.enabled = true;

					GUILayout.EndHorizontal();

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					var updateEndpoint = UpdateEndpoint;
					NekoNexusGUITools.DrawTextField(NekoNexusLocalizedStrings.SettingsUpdateEndpoint, ref updateEndpoint);

					if (updateEndpoint != UpdateEndpoint) {
						UpdateEndpoint = updateEndpoint;
						updateDirty = true;
					}
				}

				GUITools.PopGUIState();
			});
			#endregion

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			GUILayout.Label($"Version {Assembly.GetExecutingAssembly().GetName().Version}", BlueStonez.label_interparkbold_11pt);
			GUILayout.Space(4f);
			GUILayout.Label(FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).LegalCopyright.Replace("\u00a9", "(c)"), BlueStonez.label_interparkbold_11pt);

			GUITools.PopGUIState();
		}

		public static void ReloadSettings() {
			// We're bypassing the regular NekoNexusPrefs instance in order
			// to keep the web services as-is for the current game session
			WebServiceBaseUrls = NekoNexusClient.Settings.GetKey<List<string>>(NekoNexusPrefs.Key.WebServiceBaseUrls);
			WebServiceUrlIndex = NekoNexusClient.Settings.GetKey<int>(NekoNexusPrefs.Key.WebServiceUrlIndex);
			WebServiceEndpoint = NekoNexusClient.Settings.GetKey<string>(NekoNexusPrefs.Key.WebServiceEndpoint);
			WebServicePrefix = NekoNexusClient.Settings.GetKey<string>(NekoNexusPrefs.Key.WebServicePrefix);
			WebServiceSuffix = NekoNexusClient.Settings.GetKey<string>(NekoNexusPrefs.Key.WebServiceSuffix);

			FileServerUrls = NekoNexusClient.Settings.GetKey<List<string>>(NekoNexusPrefs.Key.FileServerUrls);
			FileServerUrlIndex = NekoNexusClient.Settings.GetKey<int>(NekoNexusPrefs.Key.FileServerUrlIndex);
			ImagePathEndpoint = NekoNexusClient.Settings.GetKey<string>(NekoNexusPrefs.Key.ImagePathEndpoint);

			UpdateEndpoint = NekoNexusClient.Settings.GetKey<string>(NekoNexusPrefs.Key.UpdateEndpoint);
		}

		public static void SaveSettings() {
			SaveWebServiceSettings();
			SaveFileServerSettings();
			SaveUpdateSettings();
		}

		private static void SaveWebServiceSettings() {
			if (webServicesDirty) {
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.WebServiceBaseUrls, WebServiceBaseUrls);
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.WebServiceUrlIndex, WebServiceUrlIndex);
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.WebServiceEndpoint, WebServiceEndpoint);
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.WebServiceSuffix, WebServiceSuffix);
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.WebServicePrefix, WebServicePrefix);
			}

			webServicesDirty = false;
		}

		private static void SaveFileServerSettings() {
			if (fileServersDirty) {
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.FileServerUrls, FileServerUrls);
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.FileServerUrlIndex, FileServerUrlIndex);
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.ImagePathEndpoint, ImagePathEndpoint);
			}

			fileServersDirty = false;
		}

		private static void SaveUpdateSettings() {
			if (updateDirty) {
				NekoNexusClient.Settings.SetKey(NekoNexusPrefs.Key.UpdateEndpoint, UpdateEndpoint);
			}

			updateDirty = false;
		}
	}
}
