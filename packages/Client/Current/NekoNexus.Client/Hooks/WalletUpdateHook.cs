using HarmonyLib;
using System.IO;
using UberStrike.Core.Serialization;
using UberStrike.Realtime.Client;
using UnityEngine;

// NOTE: this mod links against the stock game's ILobbyRoomEventsType (opcodes 5-23), which has no
// UpdateWallet member, so we match the raw opcode 100 the server uses (see our Core copy of
// ILobbyRoomEventsType.UpdateWallet). Keep these two in sync.

namespace NekoNexus.Client {
	/// <summary>
	/// Applies a live wallet update pushed from the server (admin gift, store purchase, or match
	/// payout) so the player's credits / coins refresh on screen WITHOUT relogging.
	///
	/// The Comm server sends a mod-only lobby event, <see cref="ILobbyRoomEventsType.UpdateWallet"/>
	/// (opcode 100, payload: Int32 credits then Int32 points). The stock game's BaseLobbyRoom.OnEvent
	/// switch only knows opcodes 5-23, so it ignores 100 entirely - we intercept it here, write the
	/// new balance into PlayerDataManager (whose Credits/Points the IMGUI ribbon reads every frame,
	/// so the display updates by itself), and swallow the event.
	/// </summary>
	[HarmonyPatch(typeof(BaseLobbyRoom))]
	public static class WalletUpdateHook {
		// Mod-only lobby event code; mirrors NekoNexus' Core ILobbyRoomEventsType.UpdateWallet = 100.
		private const byte UpdateWalletOpCode = 100;

		[HarmonyPatch("OnEvent"), HarmonyPrefix]
		public static bool OnEvent_Prefix(byte id, byte[] data) {
			if (id != UpdateWalletOpCode) {
				return true; // not ours - let the game handle it normally
			}

			try {
				using (var stream = new MemoryStream(data)) {
					// Order must match LobbyRoom.EventSender.SendUpdateWallet: credits, then points.
					int credits = Int32Proxy.Deserialize(stream);
					int points = Int32Proxy.Deserialize(stream);

					PlayerDataManager.Instance.UpdateSecurePointsAndCredits(points, credits);
					NekoNexusClient.Log.Info($"Wallet updated live: {credits} credits / {points} points.");
				}
			} catch (System.Exception ex) {
				Debug.LogWarning("WalletUpdateHook failed to apply wallet update: " + ex);
			}

			return false; // handled - don't run the stock switch
		}
	}
}
