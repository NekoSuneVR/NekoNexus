using System.Linq;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugAnimationPanel : IDebugPage {
		public string Title => "Animation";

		private CharacterConfig config;

		public void Draw() {
			NekoNexusGUITools.DrawGroup("Available Players", delegate {
				if (GameState.Current.Avatars.Count > 0) {
					var buttonWidth = NekoNexusGUITools.GetButtonWidth(GameState.Current.Avatars.Values.Select(_ => _.name), BlueStonez.buttondark_small);

					foreach (var item in GameState.Current.Avatars.Values.ToList().Select((x, i) => new { Value = x, Index = i })) {
						if (item.Index > 0) GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						if (GUILayout.Button(item.Value.name, BlueStonez.buttondark_small, GUILayout.Width(0f), GUILayout.Height(20f))) {
							config = item.Value;
						}
					}
				} else {
					GUI.enabled = false;
					GUILayout.Label("No players available", BlueStonez.label_interparkbold_11pt_left);
					GUI.enabled = true;
				}
			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("Animation Debug", delegate {
				if (config == null) {
					GUI.enabled = false;
					GUILayout.Label("Select a player", BlueStonez.label_interparkbold_11pt_left);
					GUI.enabled = true;
				} else if (config.Avatar == null) {
					GUI.enabled = false;
					GUILayout.Label("Missing decorator", BlueStonez.label_interparkbold_11pt_left);
					GUI.enabled = true;
				} else {
					// WWCD - What would Cmune do?
				}
			});
		}
	}
}
