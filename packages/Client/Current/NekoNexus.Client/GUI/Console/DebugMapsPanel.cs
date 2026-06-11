using System;
using System.Linq;
using UberStrike.Core.Models.Views;
using UberStrike.Core.Types;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugMapsPanel : IDebugPage {
		public string Title => "Maps";

		public void Draw() {
			foreach (var item in Singleton<MapManager>.Instance.AllMaps.Select((x, i) => new { Value = x, Index = i })) {
				if (item.Index > 0) {
					GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);
				}

				var uberstrikeMap = item.Value;

				NekoNexusGUITools.DrawGroup(uberstrikeMap.Name, delegate {
					NekoNexusGUITools.DrawTextField("ID", uberstrikeMap.Id);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Scene Name", uberstrikeMap.SceneName);

					if (uberstrikeMap.Id > 0) {
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
						NekoNexusGUITools.DrawTextField("Map Icon", uberstrikeMap.MapIconUrl);
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
						NekoNexusGUITools.DrawTextArea("Description", uberstrikeMap.Description);
					}

					if (uberstrikeMap.View?.Settings != null) {
						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						GUILayout.BeginHorizontal();

						GUILayout.Label("Supported Modes", BlueStonez.label_interparkbold_11pt_left, GUILayout.ExpandWidth(true), GUILayout.Height(22f));
						GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_H);

						GUILayout.BeginVertical(GUILayout.MaxWidth(NekoNexusGUITools.INPUT_WIDTH));

						foreach (var mode in Enum.GetValues(typeof(GameModeType)).Cast<GameModeType>().Where(_ => _ != GameModeType.None)) {
							GUILayout.Toggle(uberstrikeMap.View.Settings.ContainsKey(mode), mode.ToString(), GUILayout.Height(22f));
						}

						GUILayout.EndVertical();

						GUILayout.EndHorizontal();
					}

					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

					GUILayout.Toggle(uberstrikeMap.Id == 0, "Is Builtin", GUILayout.Height(22f));
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					GUILayout.Toggle(NekoNexusMapManager.IsBundleMap(uberstrikeMap.Id), "Is Bundle Map", GUILayout.Height(22f));
				});
			}
		}
	}
}
