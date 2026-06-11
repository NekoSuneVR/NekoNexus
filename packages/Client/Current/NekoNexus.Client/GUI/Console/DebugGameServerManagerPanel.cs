using System.Linq;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugGameServerManagerPanel : IDebugPage {
		public string Title => "Load Requests";

		public void Draw() {
			NekoNexusGUITools.DrawGroup("Server Load Requests", delegate {
				if (Singleton<GameServerManager>.Instance.ServerRequests.Count() == 0) {
					GUI.enabled = false;
					GUILayout.Label("Nothing to show here", BlueStonez.label_interparkbold_11pt_left);
					GUI.enabled = true;

					return;
				}

				foreach (var item in Singleton<GameServerManager>.Instance.ServerRequests.ToList().Select((x, i) => new { Value = x, Index = i })) {
					var serverLoadRequest = item.Value;

					if (item.Index > 0) {
						GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);
					}

					GUILayout.Label($"Server #{serverLoadRequest.Server.Id}", BlueStonez.label_interparkbold_11pt_left);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Server Name", serverLoadRequest.Server.Name);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Latency", serverLoadRequest.Server.Latency);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Valid", serverLoadRequest.Server.IsValid);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("State", serverLoadRequest.Server.Data.State);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Request State", serverLoadRequest.RequestState);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Peer State", serverLoadRequest.Peer.PeerState);
				}
			});
		}
	}
}
