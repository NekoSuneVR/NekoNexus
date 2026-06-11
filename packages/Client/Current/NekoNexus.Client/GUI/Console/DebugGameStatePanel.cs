using HarmonyLib;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugGameStatePanel : IDebugPage {
		public string Title => "Game States";

		private NekoNexusTraverse gameStateTraverse;

		public void Draw() {
			if (gameStateTraverse == null) {
				gameStateTraverse = NekoNexusTraverse.Create(GameState.Current);
			}

			NekoNexusGUITools.DrawGroup("Game States", delegate {
				NekoNexusGUITools.DrawTextField("Mode", $"{GameState.Current.RoomData.GameMode}/{Singleton<GameStateController>.Instance.CurrentGameMode}");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Match State", GameState.Current.MatchState.CurrentStateId);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Player State", GameState.Current.PlayerState.CurrentStateId);

				if (GameState.Current.RoomData.Server != null) {
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Server", GameState.Current.RoomData.Server.ConnectionString);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Room", $"{GameState.Current.RoomData.Name} ({GameState.Current.RoomData.Number})");
				}

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(GameState.Current.HasJoinedGame, "Has Joined Game", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(GameState.Current.IsMatchRunning, "Is Match Runníng", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(GameState.Current.PlayerData.IsSpectator, "Is Spectator", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Camera Mode", LevelCamera.CurrentMode);

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				GUILayout.Toggle(AutoMonoBehaviour<InputManager>.Instance.IsInputEnabled, "Is Input Enabled", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(Screen.lockCursor, "Lock Cursor", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Mouse", $"{UserInput.Mouse} {UserInput.Rotation}");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Key State", GameState.Current.PlayerData.KeyState);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Movement State", GameState.Current.PlayerData.MovementState);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(GameState.Current.Player.IsWalkingEnabled, "Is Walking Enabled", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(GameState.Current.Player.WeaponCamera.IsEnabled, "Weapon Camera", BlueStonez.toggle);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(GameState.Current.Player.EnableWeaponControl, "Weapon Control", BlueStonez.toggle);

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				NekoNexusGUITools.DrawTextField("Round Start Time", $"{gameStateTraverse.GetField<int>("roundStartTime")}");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Time Limit", $"{GameState.Current.RoomData.TimeLimit}");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Server Ticks", $"{Singleton<GameStateController>.Instance.Client.ServerTimeTicks}");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Game Time", $"{GameState.Current.GameTime:N2} s");
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Round Trip Time", $"{Singleton<GameStateController>.Instance.Client.Peer.RoundTripTime:N2} ms");
			});
		}
	}
}
