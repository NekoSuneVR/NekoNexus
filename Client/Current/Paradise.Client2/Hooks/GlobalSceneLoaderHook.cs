using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Cmune.Core.Models.Views;
using Cmune.DataCenter.Common.Entities;
using HarmonyLib;
using UberStrike.Core.Types;
using UberStrike.DataCenter.Common.Entities;
using UberStrike.WebService.Unity;
using UnityEngine;

namespace Paradise.Client {
	[HarmonyPatch(typeof(GlobalSceneLoader))]
	public static class GlobalSceneLoaderHook {
		private static ParadiseTraverse<GlobalSceneLoader> traverse;

		private static string ErrorMessage {
			get {
				return traverse.GetProperty<string>("ErrorMessage");
			}

			set {
				traverse.SetProperty("ErrorMessage", value);
			}
		}

		[HarmonyPatch("Start"), HarmonyPrefix]
		public static bool Start_Prefix(GlobalSceneLoader __instance) {
			traverse = ParadiseTraverse<GlobalSceneLoader>.Create(__instance);

			if (!ParadiseClient.Settings.HasKey(ParadisePrefs.Key.TelemetryChoice)) {
				PopupSystem.Show(new ParadisePopupDialog(
					ParadiseLocalizedStrings.TelemetryPopupTitle,
					ParadiseLocalizedStrings.TelemetryPopupText,
					PopupSystem.AlertType.OKCancel,
					ParadiseLocalizedStrings.Allow,
					() => {
						ParadiseClient.Settings.SetKey(ParadisePrefs.Key.TelemetryChoice, ParadisePrefs.TelemetryChoice.Yes);
						__instance.StartCoroutine(StartWithCheckingUpdates());
					},
					ParadiseLocalizedStrings.Disallow,
					() => {
						ParadiseClient.Settings.SetKey(ParadisePrefs.Key.TelemetryChoice, ParadisePrefs.TelemetryChoice.No);
						__instance.StartCoroutine(StartWithCheckingUpdates());
					},
					ParadiseLocalizedStrings.PrivacyPolicy,
					() => {
						ApplicationDataManager.OpenUrl(string.Empty, "https://google.com");
					}));
			} else {
				__instance.StartCoroutine(StartWithCheckingUpdates());
			}


			return false;
		}

		[HarmonyPatch("InitializeGlobalScene"), HarmonyPrefix]
		private static bool InitializeGlobalScene_Prefix(GlobalSceneLoader __instance) {
			ApplicationDataManager.CurrentLocale = LocaleType.en_US;

			ApplicationDataManager.ApplicationOptions.IsUsingCustom = true;
			ApplicationDataManager.ApplicationOptions.VideoTextureQuality = 0;
			ApplicationDataManager.ApplicationOptions.VideoAntiAliasing = 4;
			ApplicationDataManager.ApplicationOptions.Initialize();

			__instance.StartCoroutine(GUITools.StartScreenSizeListener(1f));

			QualitySettings.masterTextureLimit = ApplicationDataManager.ApplicationOptions.VideoTextureQuality;
			QualitySettings.vSyncCount = ApplicationDataManager.ApplicationOptions.VideoVSyncCount;
			QualitySettings.antiAliasing = ApplicationDataManager.ApplicationOptions.VideoAntiAliasing;

			AutoMonoBehaviour<SfxManager>.Instance.EnableAudio(ApplicationDataManager.ApplicationOptions.AudioEnabled);
			AutoMonoBehaviour<SfxManager>.Instance.UpdateMasterVolume();
			AutoMonoBehaviour<SfxManager>.Instance.UpdateMusicVolume();
			AutoMonoBehaviour<SfxManager>.Instance.UpdateEffectsVolume();
			AutoMonoBehaviour<InputManager>.Instance.ReadAllKeyMappings();

			return false;
		}

		#region
		private static IEnumerator StartWithCheckingUpdates() {
			AutoMonoBehaviour<PreloadOptionsPanelButton>.Instance.enabled = true;

			UnityRuntime.StartRoutine(ParadiseUpdater.CleanupUpdates());

			UnityRuntime.StartRoutine(AutoMonoBehaviour<ParadiseUpdater>.Instance.CheckForUpdatesIfNecessary((updateCatalog) => {
				if (updateCatalog != null) {
					ParadiseUpdater.HandleUpdateAvailable(updateCatalog, () => {
						traverse.Instance.StartCoroutine(Start());
					});
				} else {
					traverse.Instance.StartCoroutine(Start());
				}
			}, (error) => {
				//Log.Error(error);
				Debug.LogError(error);
				ParadiseUpdater.HandleUpdateError(error, () => {
					Application.Quit();
				});
			}));

			yield break;
		}

		private static IEnumerator Start() {
			Application.runInBackground = true;
			Application.LoadLevel("Menu");
			ParadiseTraverse.SetProperty(Singleton<SceneLoader>.Instance, "CurrentScene", "Menu");

			Configuration.WebserviceBaseUrl = ApplicationDataManager.WebServiceBaseUrl;

			traverse.SetProperty("GlobalSceneProgress", 1f);
			traverse.SetProperty("IsGlobalSceneLoaded", true);
			traverse.SetProperty("ItemAssetBundleProgress", 1f);
			traverse.SetProperty("IsItemAssetBundleLoaded", true);

			traverse.InvokeMethod("InitializeGlobalScene");

			for (float f = 0f; f < 1f; f += Time.deltaTime) {
				yield return new WaitForEndOfFrame();

				var color = traverse.GetField<Color>("_color");
				color.a = 1f - f / 1f;

				traverse.SetField("_color", color);
			}

			//yield break;

			bool continueAuthentication = true;

			yield return traverse.Instance.StartCoroutine(BeginAuthenticateApplication(delegate (AuthenticateApplicationView ev) {
				try {
					GlobalSceneLoader.IsInitialised = true;
					if (ev != null && ev.IsEnabled) {
						Configuration.EncryptionInitVector = ev.EncryptionInitVector;
						Configuration.EncryptionPassPhrase = ev.EncryptionPassPhrase;
						ApplicationDataManager.IsOnline = true;

						Debug.Log("OnAuthenticateApplication");

						Singleton<GameServerManager>.Instance.CommServer = new PhotonServer(ev.CommServer);
						Singleton<GameServerManager>.Instance.AddPhotonGameServers(ev.GameServers.FindAll((PhotonView i) => i.UsageType == PhotonUsageType.All));


						if (ev.WarnPlayer) {
							continueAuthentication = false;

							HandleVersionWarning();
						}
					} else {
						continueAuthentication = false;

						Debug.Log($"OnAuthenticateApplication failed with 4.7.1/{ApplicationDataManager.Channel}: {GlobalSceneLoader.ErrorMessage}");

						GlobalSceneLoaderHook.ErrorMessage = ParadiseLocalizedStrings.PleaseUpdate;

						HandleVersionError();
					}
				} catch (Exception ex) {
					continueAuthentication = false;

					GlobalSceneLoaderHook.ErrorMessage = ex.Message + " " + ex.StackTrace;

					Debug.LogError($"OnAuthenticateApplication crashed with 4.7.1/{ApplicationDataManager.Channel}: {GlobalSceneLoader.ErrorMessage}");
					HandleApplicationAuthenticationError(ParadiseLocalizedStrings.CheckConnection);
				}
			}, delegate (Exception e) {
				continueAuthentication = false;

				OnAuthenticateApplicationException(e);
			}));

			if (!continueAuthentication)
				yield break;

			Debug.Log("Start LoginByChannel");

			if (PlayerDataManager.IsTestBuild) {
				PopupSystem.ShowMessage(LocalizedStrings.Warning, ParadiseLocalizedStrings.ThisIsATestBuild, PopupSystem.AlertType.OK, delegate () {
					Singleton<AuthenticationManager>.Instance.LoginByChannel();
				});
			} else {
				Singleton<AuthenticationManager>.Instance.LoginByChannel();
			}

			yield break;
		}

		private static IEnumerator BeginAuthenticateApplication(Action<AuthenticateApplicationView> callback, Action<Exception> errorCallback) {
			Debug.Log("BeginAuthenticateApplication " + Configuration.WebserviceBaseUrl);

			yield return ApplicationWebServiceClient.AuthenticateApplication("4.7.1", ApplicationDataManager.Channel, string.Empty, delegate (AuthenticateApplicationView authView) {
				Debug.Log("Connected to : " + Configuration.WebserviceBaseUrl);

				callback(authView);
			}, delegate (Exception exception) {
				errorCallback(exception);
			});

			yield break;
		}

		private static void OnAuthenticateApplicationException(Exception exception) {
			ErrorMessage = exception.Message;

			Debug.LogError($"An exception occurred while authenticating the application with 4.7.1/{ApplicationDataManager.Channel}: {exception.Message}");
			HandleApplicationAuthenticationError(ParadiseLocalizedStrings.CheckConnection);
		}

		private static void RetryAuthentiateApplication() {
			//GlobalSceneLoaderHook.ErrorMessage = string.Empty;
			//UnityRuntime.StartRoutine(BeginAuthenticateApplication());
		}

		private static void HandleApplicationAuthenticationError(string message) {
			ChannelType channel = ApplicationDataManager.Channel;
			switch (channel) {
				case ChannelType.Steam:
				case ChannelType.WindowsStandalone:
				case ChannelType.OSXStandalone:
					PopupSystem.ShowError(LocalizedStrings.Error, message + Environment.NewLine + ParadiseLocalizedStrings.WSConnectionFailed, PopupSystem.AlertType.OK, new Action(Application.Quit));
					break;
				case ChannelType.IPhone:
				case ChannelType.IPad:
				case ChannelType.Android:
					PopupSystem.ShowError(LocalizedStrings.Error, message, PopupSystem.AlertType.OK, new Action(RetryAuthentiateApplication));
					break;
				default:
					if (channel != ChannelType.WebPortal && channel != ChannelType.WebFacebook) {
						PopupSystem.ShowError(LocalizedStrings.Error, message + Environment.NewLine + ParadiseLocalizedStrings.ClientTypeNotSupported, PopupSystem.AlertType.OK, new Action(Application.Quit));
					} else {
						PopupSystem.ShowError(LocalizedStrings.Error, message, PopupSystem.AlertType.None);
					}
					break;
			}
		}

		private static void HandleVersionWarning() {
			ChannelType channel = ApplicationDataManager.Channel;
			switch (channel) {
				case ChannelType.Steam:
					PopupSystem.ShowMessage(
						LocalizedStrings.Warning,
						string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateSteam),
						PopupSystem.AlertType.OKCancel,
						new Action(OpenSteamStorePage),
						ParadiseLocalizedStrings.Update,
						new Action(Singleton<AuthenticationManager>.Instance.LoginByChannel),
						LocalizedStrings.Continue
					);
					break;
				case ChannelType.IPhone:
				case ChannelType.IPad:
					PopupSystem.ShowMessage(
						LocalizedStrings.Warning,
						string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateIOS),
						PopupSystem.AlertType.OKCancel,
						new Action(OpenIosAppStoreUpdatesPage),
						ParadiseLocalizedStrings.Update,
						new Action(Singleton<AuthenticationManager>.Instance.LoginByChannel),
						LocalizedStrings.Continue
					);
					break;
				case ChannelType.Android:
					PopupSystem.ShowMessage(
						LocalizedStrings.Warning,
						string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateAndroid),
						PopupSystem.AlertType.OKCancel,
						new Action(OpenAndroidAppStoreUpdatesPage),
						ParadiseLocalizedStrings.Update,
						new Action(Singleton<AuthenticationManager>.Instance.LoginByChannel),
						LocalizedStrings.Continue
					);
					break;
				default:
					if (channel != ChannelType.WebPortal && channel != ChannelType.WebFacebook) {
						PopupSystem.ShowError(LocalizedStrings.Error, string.Format(ParadiseLocalizedStrings.ClientNotSupported, channel), PopupSystem.AlertType.OK, new Action(Application.Quit));
					} else {
						PopupSystem.ShowMessage(
							LocalizedStrings.Warning,
							string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateBrowser),
							PopupSystem.AlertType.OK,
							LocalizedStrings.Continue,
							new Action(Singleton<AuthenticationManager>.Instance.LoginByChannel)
						);
					}
					break;
			}
		}

		private static void HandleVersionError() {
			ChannelType channel = ApplicationDataManager.Channel;
			switch (channel) {
				case ChannelType.Steam:
					PopupSystem.ShowMessage(
						LocalizedStrings.Error,
						string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateSteam),
						PopupSystem.AlertType.OK,
						ParadiseLocalizedStrings.Update,
						new Action(OpenSteamStorePage)
					);
					break;
				case ChannelType.IPhone:
				case ChannelType.IPad:
					PopupSystem.ShowMessage(
						LocalizedStrings.Error,
						string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateIOS),
						PopupSystem.AlertType.OK,
						ParadiseLocalizedStrings.Update,
						new Action(OpenIosAppStoreUpdatesPage)
					);
					break;
				case ChannelType.Android:
					PopupSystem.ShowMessage(
						LocalizedStrings.Error,
						string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateAndroid),
						PopupSystem.AlertType.OK,
						ParadiseLocalizedStrings.Update,
						new Action(OpenAndroidAppStoreUpdatesPage)
					);
					break;
				default:
					if (channel != ChannelType.WebPortal && channel != ChannelType.WebFacebook) {
						PopupSystem.ShowError(LocalizedStrings.Error, string.Format(ParadiseLocalizedStrings.ClientNotSupported, channel), PopupSystem.AlertType.OK, new Action(Application.Quit));
					} else {
						PopupSystem.ShowError(LocalizedStrings.Error, string.Format(ParadiseLocalizedStrings.ClientOutOfDate, ParadiseLocalizedStrings.ClientUpdateBrowser), PopupSystem.AlertType.None);
					}
					break;
			}
		}

		private static void OpenSteamStorePage() {
			ApplicationDataManager.OpenUrl(string.Empty, "steam://store/291210");
			Application.Quit();
		}

		private static void OpenIosAppStoreUpdatesPage() {
			ApplicationDataManager.OpenUrl(string.Empty, "itms-apps://itunes.com/apps/uberstrike");
			Application.Quit();
		}

		private static void OpenAndroidAppStoreUpdatesPage() {
			ApplicationDataManager.OpenUrl(string.Empty, "market://details?id=com.cmune.uberstrike.android");
			Application.Quit();
		}
		#endregion
	}
}
