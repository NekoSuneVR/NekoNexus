using HarmonyLib;
using System.Collections.Generic;
using UnityEngine;

namespace NekoNexus.Client {
	[HarmonyPatch(typeof(InputManager))]
	public static class InputManagerHook {
		[HarmonyPatch("SetDefaultKeyMapping"), HarmonyPostfix]
		public static void SetDefaultKeyMapping_Postfix(InputManager __instance) {
			var _keyMapping = NekoNexusTraverse.GetField<Dictionary<int, UserInputMap>>(__instance, "_keyMapping");
			_keyMapping[24] = new UserInputMap(__instance.GetSlotName(GameInputKey.Chat), GameInputKey.Chat, new KeyInputChannel(KeyCode.Return), true, true, KeyCode.None);
		}

		[HarmonyPatch("GetPrefsKeyForSlot"), HarmonyPrefix]
		public static bool GetPrefsKeyForSlot_Prefix(InputManager __instance, int slot, ref CmunePrefs.Key __result) {
			if (slot == 24) {
				__result = CmunePrefs.Key.Keymap_Chat;
				return false;
			}

			return true;
		}

		[HarmonyPatch(typeof(HUDDesktopChat), "Update"), HarmonyPrefix]
		public static bool HUDDesktopChat_Update_Prefix(HUDDesktopChat __instance) {
			var keyMapping = AutoMonoBehaviour<InputManager>.Instance.KeyMapping;
			if (keyMapping.TryGetValue((int)GameInputKey.Chat, out var userInputMap)) {
				if (Input.GetKeyDown(((KeyInputChannel)userInputMap.Channel).Key) && !GameData.Instance.HUDChatIsTyping && !PopupSystem.IsAnyPopupOpen) {
					NekoNexusTraverse.InvokeMethod(__instance, "ActivateTextInput", new object[] { !GameData.Instance.HUDChatIsTyping });
				}
			}

			if (GameData.Instance.HUDChatIsTyping && !NekoNexusTraverse.GetField<UIInput>(__instance, "textInput").selected) {
				NekoNexusTraverse.InvokeMethod(__instance, "ActivateTextInput", new object[] { false });
			}

			var items = NekoNexusTraverse.GetField<List<HUDDesktopChat.Item>>(__instance, "items");
			while (items.Count > 0 && Time.time >= items[0].TimeEnd) {
				items.RemoveAt(0);
				NekoNexusTraverse.InvokeMethod(__instance, "ApplyChanges");
			}

			var spamLabel = NekoNexusTraverse.GetField<UILabel>(__instance, "spamLabel");
			var lastSpammingTime = NekoNexusTraverse.GetField<float>(__instance, "lastSpammingTime");

			if (spamLabel.enabled && Time.time >= lastSpammingTime + 5f) {
				spamLabel.enabled = false;
			}

			return false;
		}
	}
}
