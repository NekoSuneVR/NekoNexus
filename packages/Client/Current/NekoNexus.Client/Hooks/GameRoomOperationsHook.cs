using HarmonyLib;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UberStrike.Core.Serialization;
using UberStrike.Realtime.Client;
using UnityEngine;

namespace NekoNexus.Client {
	/// <summary>
	/// <br>Makes the game send pickup positions alongside respawn times</br>
	/// </summary>
	[HarmonyPatch(typeof(GameRoomOperations))]
	public static class GameRoomOperationsHook {
		[HarmonyPatch("SendPowerUpRespawnTimes"), HarmonyPrefix]
		public static bool SendPowerUpRespawnTimes_Prefix(GameRoomOperations __instance, List<ushort> respawnTimes) {
			var __id = NekoNexusTraverse.GetField<byte>(__instance, "__id");
			var sendOperation = NekoNexusTraverse.GetField<RemoteProcedureCall>(__instance, "sendOperation");

			var pickupItems = (Dictionary<int, PickupItem>)AccessTools.Field(typeof(PickupItem), "_instances").GetValue(null);
			var positions = pickupItems.Select(_ => _.Value.transform.position).ToList();

			using (MemoryStream memoryStream = new MemoryStream()) {
				ListProxy<ushort>.Serialize(memoryStream, respawnTimes, new ListProxy<ushort>.Serializer<ushort>(UInt16Proxy.Serialize));
				ListProxy<Vector3>.Serialize(memoryStream, positions, Vector3Proxy.Serialize);

				Dictionary<byte, object> customOpParameters = new Dictionary<byte, object> {
					{
						__id,
						memoryStream.ToArray()
					}
				};

				sendOperation?.Invoke(3, customOpParameters, true, 0, false);
			}

			return false;
		}
	}
}
