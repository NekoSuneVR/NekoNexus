using System.Linq;
using UnityEngine;

namespace NekoNexus.Client {
	internal class DebugApplicationPanel : IDebugPage {
		public string Title => "Application";

		public void Draw() {
			NekoNexusGUITools.DrawGroup("Application Info", delegate {
				NekoNexusGUITools.DrawTextField("Channel", ApplicationDataManager.Channel);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Version", ApplicationDataManager.Version);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Source", Application.srcValue);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("WS API", UberStrike.DataCenter.UnitySdk.ApiVersion.Current);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("RT API", UberStrike.Realtime.UnitySdk.ApiVersion.Current);
			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("User Info", delegate {
				GUILayout.Label("Player Info", BlueStonez.label_interparkbold_11pt_left);
				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				NekoNexusGUITools.DrawTextField("Player Name", PlayerDataManager.Name);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Email", PlayerDataManager.Email);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Steam ID", PlayerDataManager.SteamId);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Cmid", PlayerDataManager.Cmid);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Access Level", PlayerDataManager.AccessLevel);

				GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

				GUILayout.Label("Player Statistics/Wallet", BlueStonez.label_interparkbold_11pt_left);
				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				NekoNexusGUITools.DrawTextField("XP", PlayerDataManager.PlayerExperience);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Level", PlayerDataManager.PlayerLevel);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Credits", PlayerDataManager.Credits);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Points", PlayerDataManager.Points);

				GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

				GUILayout.Label("Clan Info", BlueStonez.label_interparkbold_11pt_left);

				var isPlayerInClan = PlayerDataManager.IsPlayerInClan;

				if (!isPlayerInClan) {
					GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

					GUI.contentColor = ColorScheme.UberStrikeYellow;
					GUILayout.Label("You're not in a clan!", BlueStonez.label_interparkbold_11pt_left);
					GUI.contentColor = Color.white;
				}

				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				GUITools.PushGUIState();
				GUI.enabled = isPlayerInClan;

				NekoNexusGUITools.DrawTextField("Clan ID", PlayerDataManager.ClanID);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Clan Name", PlayerDataManager.ClanName);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Clan Tag", PlayerDataManager.ClanTag);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Clan Motto", PlayerDataManager.ClanMotto);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Clan Owner", PlayerDataManager.ClanOwnerName);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Clan Rank", Singleton<PlayerDataManager>.Instance.RankInClan);

				GUI.enabled = true;
				GUITools.PopGUIState();
			});

			GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

			NekoNexusGUITools.DrawGroup("Server Info", delegate {
				var commServer = Singleton<GameServerManager>.Instance.CommServer;
				var gameServers = Singleton<GameServerManager>.Instance.PhotonServerList;

				GUILayout.Label("Comm Server", BlueStonez.label_interparkbold_11pt_left);
				GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

				NekoNexusGUITools.DrawTextField("Name", commServer.Name);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("ID", commServer.Id);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Connection String", commServer.ConnectionString);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Region", commServer.Region);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Latency", commServer.Latency);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Min Latency", commServer.MinLatency);

				GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

				NekoNexusGUITools.DrawTextField("Server Load", commServer.ServerLoad);

				GUILayout.Space(NekoNexusGUITools.SECTION_SPACING);

				if (gameServers.Count() == 0) {
					GUILayout.Label("Game Server", BlueStonez.label_interparkbold_11pt_left);
					GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

					GUI.contentColor = ColorScheme.UberStrikeYellow;
					GUILayout.Label("No game servers to show", BlueStonez.label_interparkbold_11pt_left);
					GUI.contentColor = Color.white;
				} else {
					foreach (var item in gameServers.ToList().Select((x, i) => new { Value = x, Index = i })) {
						GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

						GUILayout.Label($"Game Server #{item.Index + 1}", BlueStonez.label_interparkbold_11pt_left);
						GUILayout.Space(NekoNexusGUITools.ITEM_SPACING_V);

						NekoNexusGUITools.DrawTextField("Name", item.Value.Name);

						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						NekoNexusGUITools.DrawTextField("ID", item.Value.Id);

						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						NekoNexusGUITools.DrawTextField("Connection String", item.Value.ConnectionString);

						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						NekoNexusGUITools.DrawTextField("Region", item.Value.Region);

						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						NekoNexusGUITools.DrawTextField("Latency", item.Value.Latency);

						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						NekoNexusGUITools.DrawTextField("Min Latency", item.Value.MinLatency);

						GUILayout.Space(NekoNexusGUITools.LIST_ITEM_SPACING);

						NekoNexusGUITools.DrawTextField("Server Load", item.Value.ServerLoad);
					}
				}
			});
		}
	}
}
