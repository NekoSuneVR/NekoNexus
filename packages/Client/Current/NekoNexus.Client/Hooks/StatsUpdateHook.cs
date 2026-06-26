using HarmonyLib;
using System.IO;
using UberStrike.Core.Serialization;
using UberStrike.Realtime.Client;
using UnityEngine;

namespace NekoNexus.Client {
	/// <summary>
	/// Applies a live stats update pushed from the server (admin edited the player's level/xp/points)
	/// so the level badge and stats refresh WITHOUT relogging — the sibling of WalletUpdateHook.
	///
	/// The Comm server sends a mod-only lobby event (opcode 101, payload: Int32 xp then Int32 points).
	/// The stock client ignores it; we intercept it, write the new xp/points into the cached
	/// PlayerStatisticsView and re-apply it (which re-derives PlayerExperience + PlayerLevel that the
	/// IMGUI ribbon reads), then swallow the event.
	/// </summary>
	[HarmonyPatch(typeof(BaseLobbyRoom))]
	public static class StatsUpdateHook {
		// Mirrors NekoNexus' Core ILobbyRoomEventsType.UpdateStats = 101 (mod-only opcode).
		private const byte UpdateStatsOpCode = 101;

		[HarmonyPatch("OnEvent"), HarmonyPrefix]
		public static bool OnEvent_Prefix(byte id, byte[] data) {
			if (id != UpdateStatsOpCode) {
				return true; // not ours
			}

			try {
				using (var stream = new MemoryStream(data)) {
					// Order must match LobbyRoom.EventSender.SendUpdateStats: xp, then points.
					int xp = Int32Proxy.Deserialize(stream);
					int points = Int32Proxy.Deserialize(stream);

					var view = PlayerDataManager.Instance.ServerLocalPlayerStatisticsView;
					if (view != null) {
						// The client's PlayerStatisticsView exposes Xp (which drives level + the XP
						// display); the "points" currency is handled by WalletUpdateHook, so we just
						// apply Xp here and re-derive level. points is read to consume the wire payload.
						view.Xp = xp;
						PlayerDataManager.Instance.SetPlayerStatisticsView(view);
						NekoNexusClient.Log.Info($"Stats updated live: {xp} xp (points {points}).");
					}
				}
			} catch (System.Exception ex) {
				Debug.LogWarning("StatsUpdateHook failed to apply stats update: " + ex);
			}

			return false; // handled
		}
	}
}
