using ExitGames.Client.Photon;
using System.Linq;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugServerStatePanel : IDebugPage {
		public string Title => "Network";

		public void Draw() {
			NekoNexusGUITools.DrawGroup("Comm Server", delegate {
				var commPeer = AutoMonoBehaviour<CommConnectionManager>.Instance.Client.Peer;

				if (commPeer.PeerState != PeerStateValue.Connected) {
					GUI.contentColor = ColorScheme.UberStrikeYellow;
					GUILayout.Label("You're not connected to a Comm server.", BlueStonez.label_interparkbold_11pt_left);
					GUI.contentColor = Color.white;

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);
				}

				GUI.enabled = commPeer.PeerState == PeerStateValue.Connected;
				NekoNexusGUITools.DrawTextField("Address", commPeer.ServerAddress);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Peer State", commPeer.PeerState);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Server Time", commPeer.ServerTimeInMilliSeconds);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Inbound Traffic", NekoNexusGUITools.FormatSize(commPeer.BytesIn));
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Outbound Traffic", NekoNexusGUITools.FormatSize(commPeer.BytesOut));
				GUI.enabled = true;
			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("Game Server", delegate {
				var gamePeer = Singleton<GameStateController>.Instance.Client.Peer;

				if (gamePeer.PeerState != PeerStateValue.Connected) {
					GUI.contentColor = ColorScheme.UberStrikeYellow;
					GUILayout.Label("You're not connected to a Game server.", BlueStonez.label_interparkbold_11pt_left);
					GUI.contentColor = Color.white;

					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);
				}

				GUI.enabled = gamePeer.PeerState == PeerStateValue.Connected;
				NekoNexusGUITools.DrawTextField("Address", gamePeer.ServerAddress);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Peer State", gamePeer.PeerState);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Server Time", gamePeer.ServerTimeInMilliSeconds);
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Inbound Traffic", NekoNexusGUITools.FormatSize(gamePeer.BytesIn));
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				NekoNexusGUITools.DrawTextField("Outbound Traffic", NekoNexusGUITools.FormatSize(gamePeer.BytesOut));
				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				GUILayout.Toggle(Singleton<GameStateController>.Instance.Client.IsInsideRoom, "Is In Room", GUILayout.Height(22f));
				GUI.enabled = true;
			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("All Servers", delegate {
				if (Singleton<GameServerManager>.Instance.PhotonServerList.Count() == 0) {
					GUI.enabled = false;
					GUILayout.Label("Please open the \"Play\" menu first.", BlueStonez.label_interparkbold_11pt_left);
					GUI.enabled = true;

					return;
				}

				foreach (var item in Singleton<GameServerManager>.Instance.PhotonServerList.Select((x, i) => new { Value = x, Index = i })) {
					if (item.Index > 0) {
						GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);
					}

					var photonServer = item.Value;

					GUILayout.Label($"({photonServer.Id}) {photonServer.Name}", BlueStonez.label_interparkbold_11pt_left);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Address", photonServer.ConnectionString);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Min Latency", photonServer.MinLatency);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Latency", photonServer.Latency);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
					NekoNexusGUITools.DrawTextField("Region", photonServer.Region);
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);
				}
			});
		}
	}
}
