using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace Paradise.Client {
	[HarmonyPatch(typeof(OptionsPanelGUI))]
	public static class OptionsPanelGUIHook {
		private const float MIN_MOUSE_SENSITIVITY = 0.1f;
		private const float MAX_MOUSE_SENSITIVITY = 10f;

		private static ParadiseTraverse<OptionsPanelGUI> traverse;

		private static Vector2 scrollPos;
		private static float keyAssignmentDescriptionMaxWidth = -1;

		private static int _oldScreenResIndex = -1;
		private static int _newScreenResIndex = -1;

		private static readonly Vector2 defaultResolution = new Vector2(989, 560);
		private static bool useCustomResolution = ScreenResolutionManager.CurrentResolutionIndex == -1;
		private static int resX = Screen.width;
		private static int resY = Screen.height;

		[HarmonyPatch("Awake"), HarmonyPostfix]
		public static void Awake_Postfix(OptionsPanelGUI __instance) {
			if (traverse == null) {
				traverse = ParadiseTraverse<OptionsPanelGUI>.Create(__instance);
			}

			List<string> list = new List<string>();

			foreach (Resolution resolution in ScreenResolutionManager.Resolutions) {
				list.Add($"{resolution.width} X {resolution.height}");
			}

			traverse.SetField("_screenResText", list.ToArray());

			ParadisePrefsPanelGUI.ReloadSettings();
		}

		[HarmonyPatch("Start"), HarmonyPrefix]
		public static bool Start_Prefix() {
			traverse.SetField("_optionsTabs", new GUIContent[] {
				new GUIContent(LocalizedStrings.ControlsCaps),
				new GUIContent(LocalizedStrings.AudioCaps),
				new GUIContent(LocalizedStrings.VideoCaps),
				new GUIContent(ParadiseLocalizedStrings.ParadiseCaps)
			});

			traverse.SetField("qualitySet", new string[] {
				ParadiseLocalizedStrings.Low,
				ParadiseLocalizedStrings.Medium,
				ParadiseLocalizedStrings.High,
				LocalizedStrings.Custom
			});

			traverse.SetField("_selectedOptionsTab", 0);
			traverse.SetField("_keyCount", AutoMonoBehaviour<InputManager>.Instance.KeyMapping.Values.Count);

			return false;
		}

		[HarmonyPatch("OnGUI"), HarmonyPrefix]
		public static bool OnGUI_Prefix() {
			GUI.skin = BlueStonez.Skin;
			GUI.depth = -97;

			if (!AuthenticationManager.Instance.IsAuthComplete && PopupSystem.IsAnyPopupOpen) {
				if (ParadisePrefsPanelGUI.UpdateDisableConfirmation == null) {
					GUI.depth = -101;
				}
			}

			var _rect = new Rect {
				x = (Screen.width - Mathf.Min(Screen.width, ParadiseGUITools.OPTIONS_PANEL_WIDTH)) / 2,
				y = (Screen.height - Mathf.Min(Screen.height, ParadiseGUITools.OPTIONS_PANEL_HEIGHT)) / 2,
				width = Mathf.Min(Screen.width, ParadiseGUITools.OPTIONS_PANEL_WIDTH),
				height = Mathf.Min(Screen.height, ParadiseGUITools.OPTIONS_PANEL_HEIGHT)
			};

			traverse.SetField("_rect", _rect);

			GUI.BeginGroup(_rect, GUIContent.none, BlueStonez.window_standard_grey38);

			var hasTimeout = traverse.GetField<float>("_screenResChangeDelay") > 0f;

			GUI.enabled = !hasTimeout;
			traverse.InvokeMethod("DrawOptionsPanel");
			GUI.enabled = true;

			GUI.EndGroup();
			GuiManager.DrawTooltip();

			if (hasTimeout) {
				traverse.InvokeMethod("DrawScreenResChangePanel");
			}

			return false;
		}

		[HarmonyPatch("DrawOptionsPanel"), HarmonyPrefix]
		public static bool DrawOptionsPanel_Prefix() {
			var _rect = traverse.GetField<Rect>("_rect");

			GUILayout.BeginVertical(GUILayout.Width(_rect.width), GUILayout.Height(_rect.height));
			GUILayout.Label(LocalizedStrings.OptionsCaps, BlueStonez.tab_strip, GUILayout.Height(ParadiseGUITools.PANEL_TITLE_HEIGHT));

			var _selectedOptionsTab = traverse.GetField<int>("_selectedOptionsTab");
			var _optionsTabs = traverse.GetField<GUIContent[]>("_optionsTabs");

			traverse.SetField("_selectedOptionsTab", GUILayout.Toolbar(_selectedOptionsTab, _optionsTabs, BlueStonez.tab_medium));

			if (GUI.changed) {
				GUI.changed = false;
				AutoMonoBehaviour<SfxManager>.Instance.Play2dAudioClip(GameAudio.ButtonClick);
				scrollPos = Vector2.zero;
			}

			scrollPos = GUILayout.BeginScrollView(scrollPos, false, true, GUIStyle.none, BlueStonez.verticalScrollbar, BlueStonez.scrollView);
			GUILayout.BeginHorizontal(BlueStonez.window_standard_grey38, GUILayout.Height(_rect.height - 56f - 48f));
			GUILayout.Space(ParadiseGUITools.PANEL_PADDING_H);

			GUILayout.BeginVertical();
			GUILayout.Space(ParadiseGUITools.PANEL_PADDING_V);

			try {
				switch (_selectedOptionsTab) {
					case 0:
						traverse.InvokeMethod("DoControlsGroup");
						break;
					case 1:
						traverse.InvokeMethod("DoAudioGroup");
						break;
					case 2:
						traverse.InvokeMethod("DoVideoGroup");
						break;
					case 3:
						DoParadiseGroup();
						break;
				}
			} catch (Exception e) {
				Debug.LogError(e);
			}

			GUILayout.Space(ParadiseGUITools.PANEL_PADDING_V);
			GUILayout.EndVertical();

			GUILayout.Space(ParadiseGUITools.PANEL_PADDING_H_SCROLLBAR);
			GUILayout.EndHorizontal();
			GUILayout.EndScrollView();

			// Button Strip
			GUILayout.Space(ParadiseGUITools.PANEL_BUTTON_PADDING_V);

			GUILayout.BeginHorizontal();
			GUILayout.Space(ParadiseGUITools.PANEL_BUTTON_PADDING_H);

			if (_selectedOptionsTab == 0 && !ApplicationDataManager.IsMobile && GUILayout.Button(LocalizedStrings.ResetDefaults, BlueStonez.button, GUILayout.Width(150f), GUILayout.Height(ParadiseGUITools.PANEL_BUTTON_HEIGHT))) {
				AutoMonoBehaviour<InputManager>.Instance.Reset();
			} else if (_selectedOptionsTab == 1) {
				GUILayout.Label(string.Empty, GUILayout.Width(150f));
			} else if (_selectedOptionsTab == 2) {
				GUILayout.Label($"FPS: {1f / Time.smoothDeltaTime:F2}", BlueStonez.label_interparkbold_16pt_left, GUILayout.Width(150f), GUILayout.Height(ParadiseGUITools.PANEL_BUTTON_HEIGHT));
			} else if (_selectedOptionsTab == 3 && GUILayout.Button(LocalizedStrings.ResetDefaults, BlueStonez.button, GUILayout.Width(150f), GUILayout.Height(ParadiseGUITools.PANEL_BUTTON_HEIGHT))) {
				ParadiseClient.Settings.ResetDefaults();
				ParadisePrefsPanelGUI.ReloadSettings();
			}

			GUILayout.FlexibleSpace();

			if (_selectedOptionsTab == 0 && AutoMonoBehaviour<InputManager>.Instance.HasUnassignedKeyMappings) {
				GUI.contentColor = Color.red;
				GUILayout.Label(LocalizedStrings.UnassignedKeyMappingsWarningMsg, BlueStonez.label_interparkmed_11pt, GUILayout.Width(_rect.width - 182f - 152f), GUILayout.Height(ParadiseGUITools.PANEL_BUTTON_HEIGHT));
				GUI.contentColor = Color.white;

				GUILayout.FlexibleSpace();
			} else if (_selectedOptionsTab == 3 && ParadisePrefsPanelGUI.HasInvalidServerURLs) {
				GUI.contentColor = Color.red;
				GUILayout.Label(ParadiseLocalizedStrings.InvalidServerURL, BlueStonez.label_interparkmed_11pt, GUILayout.Width(_rect.width - 182f - 152f), GUILayout.Height(ParadiseGUITools.PANEL_BUTTON_HEIGHT));
				GUI.contentColor = Color.white;

				GUILayout.FlexibleSpace();
			}

			if (GUILayout.Button(LocalizedStrings.OkCaps, BlueStonez.button, GUILayout.Width(120f), GUILayout.Height(ParadiseGUITools.PANEL_BUTTON_HEIGHT))) {
				ApplicationDataManager.ApplicationOptions.SaveApplicationOptions();

				ParadisePrefsPanelGUI.SaveSettings();
				ParadiseClient.Settings.SaveSettings();

				PanelManager.Instance.ClosePanel(PanelType.Options);
			}

			GUILayout.Space(ParadiseGUITools.PANEL_BUTTON_PADDING_H);
			GUILayout.EndHorizontal();

			GUILayout.Space(ParadiseGUITools.PANEL_BUTTON_PADDING_V);

			GUILayout.EndVertical();

			return false;
		}

		[HarmonyPatch("DoControlsGroup"), HarmonyPrefix]
		public static bool DoControlsGroup_Prefix() {
			GUITools.PushGUIState();
			GUI.enabled = (traverse.GetField<UserInputMap>("_targetMap") == null);

			#region Mouse Settings
			ParadiseGUITools.DrawGroup(LocalizedStrings.Mouse, delegate {
				// Mouse Sensitivity
				ParadiseGUITools.DrawSlider(ParadiseLocalizedStrings.InputXMouseSensitivity, ref ApplicationDataManager.ApplicationOptions.InputXMouseSensitivity, MIN_MOUSE_SENSITIVITY, MAX_MOUSE_SENSITIVITY);

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				ParadiseGUITools.DrawSlider(ParadiseLocalizedStrings.InputYMouseSensitivity, ref ApplicationDataManager.ApplicationOptions.InputYMouseSensitivity, MIN_MOUSE_SENSITIVITY, MAX_MOUSE_SENSITIVITY);

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				ParadiseGUITools.DrawSlider(ParadiseLocalizedStrings.InputMouseRotationMinY, ref ApplicationDataManager.ApplicationOptions.InputMouseRotationMinY, -90f, -75f);

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				ParadiseGUITools.DrawSlider(ParadiseLocalizedStrings.InputMouseRotationMaxY, ref ApplicationDataManager.ApplicationOptions.InputMouseRotationMaxY, 75f, 90f);

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Invert Mouse
				var invertMouse = GUILayout.Toggle(ApplicationDataManager.ApplicationOptions.InputInvertMouse, ParadiseLocalizedStrings.InputInvertMouse, BlueStonez.toggle);

				if (invertMouse != ApplicationDataManager.ApplicationOptions.InputInvertMouse) {
					ApplicationDataManager.ApplicationOptions.InputInvertMouse = invertMouse;
				}
			});
			#endregion

			#region Gamepad Settings
			if (Input.GetJoystickNames().Length > 0) {
				GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

				ParadiseGUITools.DrawGroup(LocalizedStrings.Gamepad, delegate {
					var enableGamepad = GUILayout.Toggle(AutoMonoBehaviour<InputManager>.Instance.IsGamepadEnabled, !string.IsNullOrEmpty(Input.GetJoystickNames()[0].Trim()) ? Input.GetJoystickNames()[0] : "Gamepad#0", BlueStonez.toggle);

					if (enableGamepad != AutoMonoBehaviour<InputManager>.Instance.IsGamepadEnabled) {
						AutoMonoBehaviour<InputManager>.Instance.IsGamepadEnabled = enableGamepad;
					}
				});
			} else {
				AutoMonoBehaviour<InputManager>.Instance.IsGamepadEnabled = false;
			}
			#endregion

			GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

			#region Input Settings
			ParadiseGUITools.DrawGroup(LocalizedStrings.Keyboard, delegate {
				GUILayout.BeginHorizontal();

				if (keyAssignmentDescriptionMaxWidth < 0) {
					keyAssignmentDescriptionMaxWidth = AutoMonoBehaviour<InputManager>.Instance.KeyMapping.Values.Select(_ => ParadiseGUITools.GetWidth(_.Description, BlueStonez.label_interparkmed_10pt_left)).Max();
				}

				GUILayout.Label(LocalizedStrings.Movement, BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(keyAssignmentDescriptionMaxWidth));
				GUILayout.Space(ParadiseGUITools.SECTION_SPACING * 2 + 20);
				GUILayout.Label(LocalizedStrings.KeyButton, BlueStonez.label_interparkbold_11pt_left, GUILayout.ExpandWidth(true));

				GUILayout.EndHorizontal();

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				foreach (UserInputMap userInputMap in AutoMonoBehaviour<InputManager>.Instance.KeyMapping.Values) {
					if (!userInputMap.IsConfigurable)
						continue;

					GUILayout.BeginHorizontal();
					GUILayout.Label(userInputMap.Description, BlueStonez.label_interparkmed_10pt_left, GUILayout.Width(keyAssignmentDescriptionMaxWidth), GUILayout.Height(20f));
					GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

					bool isTargetMap = userInputMap == traverse.GetField<UserInputMap>("_targetMap");
					if (userInputMap.IsConfigurable) {
						if (GUILayout.Toggle(isTargetMap, string.Empty, BlueStonez.radiobutton, GUILayout.Width(20f))) {
							traverse.SetField("_targetMap", userInputMap);
							Screen.lockCursor = true;
						}
					} else {
						GUILayout.Space(20f);
					}

					GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

					if (isTargetMap) {
						GUILayout.TextField(string.Empty, BlueStonez.textField, GUILayout.ExpandWidth(true), GUILayout.Height(20f));
					} else {
						GUI.contentColor = ((userInputMap.Channel == null) ? Color.red : Color.white);
						GUILayout.Label(userInputMap.Assignment, BlueStonez.label_interparkmed_10pt_left, GUILayout.ExpandWidth(true), GUILayout.Height(20f));
						GUI.contentColor = Color.white;
					}

					GUILayout.EndHorizontal();
				}
			});

			if (traverse.GetField<UserInputMap>("_targetMap") != null && Event.current.type == EventType.Layout && AutoMonoBehaviour<InputManager>.Instance.ListenForNewKeyAssignment(traverse.GetField<UserInputMap>("_targetMap"))) {
				traverse.SetField("_targetMap", null);
				Screen.lockCursor = false;
				Event.current.Use();
			}
			#endregion

			GUITools.PopGUIState();

			return false;
		}

		[HarmonyPatch("DoAudioGroup"), HarmonyPrefix]
		public static bool DoAudioGroup_Prefix() {
			GUITools.PushGUIState();

			ParadiseGUITools.DrawGroup(LocalizedStrings.Volume, delegate {
				// Mute Audio
				ApplicationDataManager.ApplicationOptions.AudioEnabled = !GUILayout.Toggle(!ApplicationDataManager.ApplicationOptions.AudioEnabled, LocalizedStrings.Mute, BlueStonez.toggle);

				if (GUI.changed) {
					GUI.changed = false;
					AutoMonoBehaviour<SfxManager>.Instance.EnableAudio(ApplicationDataManager.ApplicationOptions.AudioEnabled);
				}

				GUITools.PushGUIState();
				GUI.enabled = ApplicationDataManager.ApplicationOptions.AudioEnabled;

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Master Volume
				ParadiseGUITools.DrawSlider(LocalizedStrings.MasterVolume, ref ApplicationDataManager.ApplicationOptions.AudioMasterVolume, 0f, 1f, delegate (float value) {
					GUILayout.Label($"{value * 100:F0} %", BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(ParadiseGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Music Volume
				ParadiseGUITools.DrawSlider(LocalizedStrings.MusicVolume, ref ApplicationDataManager.ApplicationOptions.AudioMusicVolume, 0f, 1f, delegate (float value) {
					GUILayout.Label($"{value * 100:F0} %", BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(ParadiseGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Effects Volume
				ParadiseGUITools.DrawSlider(LocalizedStrings.EffectsVolume, ref ApplicationDataManager.ApplicationOptions.AudioEffectsVolume, 0f, 1f, delegate (float value) {
					GUILayout.Label($"{value * 100:F0} %", BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(ParadiseGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));
				});

				GUI.enabled = true;
				GUITools.PopGUIState();
			});

			GUITools.PopGUIState();

			return false;
		}

		[HarmonyPatch("DoVideoGroup"), HarmonyPrefix]
		public static bool DoVideoGroup_Prefix() {
			GUITools.PushGUIState();

			ParadiseGUITools.DrawGroup(LocalizedStrings.QualitySettings, delegate {
				var vsyncSet = new string[] { "Off", "Full", "Half" };
				var antiAliasingSet = traverse.GetField<string[]>("antiAliasingSet");

				// Texture Quality
				var textureQuality = traverse.GetField<float>("_textureQuality");
				ParadiseGUITools.DrawSlider(LocalizedStrings.TextureQuality, ref textureQuality, 1f, 5f, delegate (float value) {
					GUILayout.Label((value >= 0f) ? Mathf.RoundToInt(value).ToString() : LocalizedStrings.Auto, BlueStonez.label_interparkbold_11pt_left, GUILayout.Width(ParadiseGUITools.SLIDER_VALUE_WIDTH), GUILayout.Height(22f));

					if (value != traverse.GetField<float>("_textureQuality")) {
						traverse.SetField("_textureQuality", textureQuality);
						traverse.InvokeMethod("UpdateTextureQuality");
					}
				});

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Vertical Sync
				var vsync = traverse.GetField<int>("_vsync");
				ParadiseGUITools.DrawToolbar(LocalizedStrings.VSync, ref vsync, vsyncSet);

				if (vsync != traverse.GetField<int>("_vsync")) {
					traverse.SetField("_vsync", vsync);
					traverse.InvokeMethod("UpdateVSyncCount");
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Anti-Aliasing
				var antiAliasing = traverse.GetField<int>("_antiAliasing");
				ParadiseGUITools.DrawToolbar(LocalizedStrings.AntiAliasing, ref antiAliasing, antiAliasingSet);

				if (antiAliasing != traverse.GetField<int>("_antiAliasing")) {
					traverse.SetField("_antiAliasing", antiAliasing);
					traverse.InvokeMethod("UpdateAntiAliasing");
				}

				// Post-Processing Effects
				if (!ApplicationDataManager.IsMobile) {
					GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					var postProcessing = GUILayout.Toggle(ApplicationDataManager.ApplicationOptions.VideoPostProcessing, LocalizedStrings.ShowPostProcessingEffects, BlueStonez.toggle);
					traverse.SetField("_postProcessing", postProcessing);
					if (postProcessing != ApplicationDataManager.ApplicationOptions.VideoPostProcessing) {
						traverse.InvokeMethod("UpdatePostProcessing");
					}

					//GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

					//GUITools.PushGUIState();
					//GUI.enabled = GUI.enabled && postProcessing;

					//var bloom = GUILayout.Toggle(ApplicationDataManager.ApplicationOptions.VideoBloomAndFlares, ParadiseLocalizedStrings.VideoBloomAndFlares, BlueStonez.toggle);
					//if (bloom != ApplicationDataManager.ApplicationOptions.VideoBloomAndFlares) {
					//	ApplicationDataManager.ApplicationOptions.VideoBloomAndFlares = bloom;
					//	traverse.InvokeMethod("UpdatePostProcessing");
					//}

					//GUILayout.Space(ParadiseGUITools.LIST_ITEM_SPACING);

					//var vignette = GUILayout.Toggle(ApplicationDataManager.ApplicationOptions.VideoVignetting, ParadiseLocalizedStrings.VideoVignetting, BlueStonez.toggle);
					//if (vignette != ApplicationDataManager.ApplicationOptions.VideoVignetting) {
					//	ApplicationDataManager.ApplicationOptions.VideoVignetting = vignette;
					//	traverse.InvokeMethod("UpdatePostProcessing");
					//}

					//GUILayout.Space(ParadiseGUITools.LIST_ITEM_SPACING);

					//var motionBlur = GUILayout.Toggle(ApplicationDataManager.ApplicationOptions.VideoMotionBlur, ParadiseLocalizedStrings.VideoMotionBlur, BlueStonez.toggle);
					//if (motionBlur != ApplicationDataManager.ApplicationOptions.VideoMotionBlur) {
					//	ApplicationDataManager.ApplicationOptions.VideoMotionBlur = motionBlur;
					//	traverse.InvokeMethod("UpdatePostProcessing");
					//}

					//GUITools.PopGUIState();
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				// Show ingame FPS
				var showFps = GUILayout.Toggle(ApplicationDataManager.ApplicationOptions.VideoShowFps, LocalizedStrings.ShowFPS, BlueStonez.toggle);
				if (showFps != ApplicationDataManager.ApplicationOptions.VideoShowFps) {
					ApplicationDataManager.ApplicationOptions.VideoShowFps = showFps;
				}
			});

			GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

			ParadiseGUITools.DrawGroup(LocalizedStrings.ScreenResolution, delegate {
				var useFullscreen = GUILayout.Toggle(Screen.fullScreen, ParadiseLocalizedStrings.UseFullscreen, BlueStonez.toggle);
				if (useFullscreen != Screen.fullScreen) {
					Screen.fullScreen = useFullscreen;
				}

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				GUILayout.BeginHorizontal();
				useCustomResolution = GUILayout.Toggle(useCustomResolution, ParadiseLocalizedStrings.CustomResolution, BlueStonez.toggle);

				GUILayout.Space(ParadiseGUITools.SECTION_SPACING);

				GUITools.PushGUIState();
				GUI.enabled = useCustomResolution;

				int.TryParse(GUILayout.TextField(resX.ToString(), BlueStonez.textField, GUILayout.Width(100f), GUILayout.Height(22f)), out resX);
				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_H);
				int.TryParse(GUILayout.TextField(resY.ToString(), BlueStonez.textField, GUILayout.Width(100f), GUILayout.Height(22f)), out resY);
				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_H);

				GUITools.PushGUIState();
				GUI.enabled = resX >= 640 && resY >= 360 && (resX != Screen.width || resY != Screen.height);

				if (GUILayout.Button(ParadiseLocalizedStrings.Apply, BlueStonez.buttondark_small, GUILayout.Width(80f), GUILayout.Height(22f))) {
					Screen.SetResolution(resX, resY, Screen.fullScreen);

					traverse.InvokeMethod("ShowScreenResChangeConfirmation", ScreenResolutionManager.CurrentResolutionIndex, -1);
				}

				GUITools.PopGUIState();

				GUILayout.EndHorizontal();
				GUITools.PopGUIState();

				GUILayout.Space(ParadiseGUITools.ITEM_SPACING_V);

				var resolutionIndex = GUILayout.SelectionGrid(useCustomResolution ? -1 : ScreenResolutionManager.CurrentResolutionIndex, traverse.GetField<string[]>("_screenResText"), 1, BlueStonez.radiobutton);

				if (resolutionIndex >= 0 && resolutionIndex != ScreenResolutionManager.CurrentResolutionIndex) {
					useCustomResolution = false;
					var resolution = ScreenResolutionManager.Resolutions[resolutionIndex];
					Screen.SetResolution(resolution.width, resolution.height, Screen.fullScreen);
					resX = resolution.width;
					resY = resolution.height;

					if (Screen.fullScreen) {
						traverse.InvokeMethod("ShowScreenResChangeConfirmation", ScreenResolutionManager.CurrentResolutionIndex, resolutionIndex);
					}
				}
			});

			GUITools.PopGUIState();

			return false;
		}

		private static void DoParadiseGroup() {
			ParadisePrefsPanelGUI.Draw();
		}

		[HarmonyPatch("ShowScreenResChangeConfirmation"), HarmonyPrefix]
		public static bool ShowScreenResChangeConfirmation_Prefix(int oldRes, int newRes) {
			traverse.SetField("_screenResChangeDelay", 15f);
			_newScreenResIndex = newRes;
			_oldScreenResIndex = oldRes;

			return false;
		}

		[HarmonyPatch("DrawScreenResChangePanel"), HarmonyPrefix]
		public static bool DrawScreenResChangePanel_Prefix() {
			var _screenResChangeDelay = traverse.GetField<float>("_screenResChangeDelay");

			var rect = new Rect {
				x = (Screen.width - 320f) / 2,
				y = (Screen.height - 240f) / 2,
				width = 320f,
				height = 240f
			};

			GUI.depth = 1;
			GUI.BeginGroup(rect, string.Empty, BlueStonez.window_standard_grey38);
			GUI.Label(new Rect(0f, 0f, rect.width, ParadiseGUITools.PANEL_TITLE_HEIGHT), LocalizedStrings.ChangingScreenResolution, BlueStonez.tab_strip);
			GUI.Label(new Rect(16f, ParadiseGUITools.PANEL_TITLE_HEIGHT, rect.width - 32f, rect.height - ParadiseGUITools.PANEL_TITLE_HEIGHT - 32f), Math.Ceiling(_screenResChangeDelay).ToString("N0"), BlueStonez.label_interparkbold_48pt);
			GUI.Label(new Rect(10f, ParadiseGUITools.PANEL_TITLE_HEIGHT + 8f, rect.width - 20f, 40f), string.Format(ParadiseLocalizedStrings.ResolutionSet, Screen.width, Screen.height), BlueStonez.label_interparkbold_13pt);


			if (GUITools.Button(new Rect(rect.width * 0.5f - 125f, rect.height - 40f, 120f, 32f), new GUIContent(ParadiseLocalizedStrings.Yes), BlueStonez.button)) {
				if (_newScreenResIndex >= 0) {
					ScreenResolutionManager.SetResolution(_newScreenResIndex, Screen.fullScreen);
				}

				_oldScreenResIndex = -1;
				_newScreenResIndex = -1;

				GuiLockController.ReleaseLock(GuiDepth.Popup);
				traverse.SetField("_screenResChangeDelay", 0f);
			}

			if (GUITools.Button(new Rect(rect.width * 0.5f + 5f, rect.height - 40f, 120f, 32f), new GUIContent(ParadiseLocalizedStrings.No), BlueStonez.button)) {
				if (_oldScreenResIndex >= 0) {
					var resolution = ScreenResolutionManager.Resolutions[_oldScreenResIndex];
					Screen.SetResolution(resolution.width, resolution.height, Screen.fullScreen);
				} else {
					Screen.SetResolution((int)defaultResolution.x, (int)defaultResolution.y, Screen.fullScreen);
				}

				GuiLockController.ReleaseLock(GuiDepth.Popup);
				traverse.SetField("_screenResChangeDelay", 0f);
			}

			GUI.EndGroup();

			return false;
		}

		[HarmonyPatch("Update"), HarmonyPrefix]
		public static bool Update() {
			var _screenResChangeDelay = traverse.GetField<float>("_screenResChangeDelay");

			if (_screenResChangeDelay > 0f) {
				_screenResChangeDelay -= Time.deltaTime;
				if (_screenResChangeDelay <= 0f && _oldScreenResIndex >= 0) {
					var resolution = ScreenResolutionManager.Resolutions[_oldScreenResIndex];
					Screen.SetResolution(resolution.width, resolution.height, Screen.fullScreen);

					useCustomResolution = false;
					resX = resolution.width;
					resY = resolution.height;

					GuiLockController.ReleaseLock(GuiDepth.Popup);
				}

				traverse.SetField("_screenResChangeDelay", _screenResChangeDelay);
			}

			return false;
		}
	}
}
