using System.Linq;
using UberStrike.Realtime.UnitySdk;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugPlayerManagerPanel : IDebugPage {
		public string Title => "Player Manager";

		public void Draw() {
			if (GameState.Current.Players.Count == 0) {
				NekoNexusGUITools.DrawGroup("Players", delegate {
					GUI.enabled = false;
					GUILayout.Label("No players to show", BlueStonez.label_interparkbold_11pt_left);
					GUI.enabled = true;
				});

				return;
			}

			foreach (var item in GameState.Current.Players.Values.Select((x, i) => new { Value = x, Index = i })) {
				if (item.Index > 0) {
					GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);
				}

				var gameActorInfo = item.Value;

				ICharacterState characterState = GameState.Current.RemotePlayerStates.GetState(gameActorInfo.PlayerId);
				if (gameActorInfo.Cmid == PlayerDataManager.Cmid) {
					characterState = GameState.Current.PlayerData;
				}

				NekoNexusGUITools.DrawGroup(gameActorInfo.PlayerName, delegate {
					NekoNexusGUITools.DrawTextField("Cmid", gameActorInfo.Cmid);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Player ID", gameActorInfo.PlayerId);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Player State", gameActorInfo.PlayerState);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Current Weapon", $"Slot: {gameActorInfo.CurrentWeaponSlot}, Weapon: {gameActorInfo.CurrentWeaponID}");
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Life", $"{gameActorInfo.Health} HP / {gameActorInfo.ArmorPoints} AP");
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Team", gameActorInfo.TeamID);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Weapons", string.Join(", ", gameActorInfo.Weapons.Select(_ => _.ToString()).ToArray()));
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Gear", string.Join(", ", gameActorInfo.Gear.Select(_ => _.ToString()).ToArray()));
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

					if (characterState != null) {
						GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

						NekoNexusGUITools.DrawTextField("Key States", CmunePrint.Flag(characterState.KeyState));
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
						NekoNexusGUITools.DrawTextField("Movement States", CmunePrint.Flag(characterState.MovementState));
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						var num = Mathf.Clamp(characterState.VerticalRotation + 90f, 0f, 180f) / 180f;
						NekoNexusGUITools.DrawTextField("Rotation", $"{characterState.HorizontalRotation} / {characterState.VerticalRotation:F2} / {num:F2}");
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						NekoNexusGUITools.DrawTextField("Position", characterState.Position);
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
						NekoNexusGUITools.DrawTextField("Velocity", characterState.Velocity);
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					}

					NekoNexusGUITools.DrawTextField("Avatar", GameState.Current.Avatars.ContainsKey(gameActorInfo.Cmid));
					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					if (gameActorInfo.Cmid != PlayerDataManager.Cmid || true) {
						if (GUILayout.Button("Kick", BlueStonez.buttondark_small, GUILayout.Height(NekoNexusGUITools.BUTTON_HEIGHT))) {
							GameState.Current.Actions.KickPlayer(gameActorInfo.Cmid);
						}
					}
				});
			}
		}
	}
}
