using Cmune.DataCenter.Common.Entities;
using HarmonyLib;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using UberStrike.Core.Models.Views;
using UberStrike.Core.Serialization;
using UberStrike.Core.Types;
using UnityEngine;

namespace NekoNexus.Client {
	public static class NekoNexusWebServiceClient {
		public static string WebServiceName => "NekoNexusWebService";
		public static string ContractName => "INekoNexusWebServiceContract";

		#region
		private static MonoBehaviour Mono = Traverse.Create(AccessTools.TypeByName("UberStrike.WebService.Unity.MonoInstance")).Property<MonoBehaviour>("Mono").Value;
		private static MethodInfo MakeRequest_impl = AccessTools.TypeByName("UberStrike.WebService.Unity.SoapClient").GetMethod("MakeRequest", BindingFlags.Public | BindingFlags.Static);
		#endregion

		public static Coroutine GetCustomMaps(string clientVersion, DefinitionType clientType, Action<List<NekoNexusMapView>> callback, Action<Exception> handler) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				StringProxy.Serialize(memoryStream, clientVersion);
				EnumProxy<DefinitionType>.Serialize(memoryStream, clientType);

				return Mono.StartCoroutine(MakeRequest(
					ContractName,
					$"{NekoNexusClient.Settings.WebServicePrefix}{WebServiceName}{NekoNexusClient.Settings.WebServiceSuffix}",
					MethodBase.GetCurrentMethod().Name,
					memoryStream.ToArray(),
					(byte[] data) => {
						callback?.Invoke(ListProxy<NekoNexusMapView>.Deserialize(new MemoryStream(data), NekoNexusMapViewProxy.Deserialize));
					},
					handler
				));
			}
		}

		public static Coroutine RecordPlayerMachineData() {
			if (!NekoNexusClient.Settings.AllowTelemetry)
				return null;

			using (MemoryStream memoryStream = new MemoryStream()) {
				StringProxy.Serialize(memoryStream, PlayerPrefs.GetString("Version"));
				Int32Proxy.Serialize(memoryStream, PlayerDataManager.Cmid);
				StringProxy.Serialize(memoryStream, SystemInfo.deviceUniqueIdentifier);
				StringProxy.Serialize(memoryStream, SystemInfo.deviceModel);
				StringProxy.Serialize(memoryStream, SystemInfo.deviceType.ToString());
				StringProxy.Serialize(memoryStream, SystemInfo.operatingSystem);
				StringProxy.Serialize(memoryStream, SystemInfo.processorType);
				Int32Proxy.Serialize(memoryStream, SystemInfo.processorCount);
				Int32Proxy.Serialize(memoryStream, SystemInfo.systemMemorySize);
				StringProxy.Serialize(memoryStream, SystemInfo.graphicsDeviceVendor);
				StringProxy.Serialize(memoryStream, $"{SystemInfo.graphicsDeviceVendorID:x4}");
				StringProxy.Serialize(memoryStream, $"{SystemInfo.graphicsDeviceID:x4}");
				Int32Proxy.Serialize(memoryStream, SystemInfo.graphicsMemorySize);
				StringProxy.Serialize(memoryStream, SystemInfo.graphicsDeviceVersion);

				return Mono.StartCoroutine(MakeRequest(
					ContractName,
					$"{NekoNexusClient.Settings.WebServicePrefix}{WebServiceName}{NekoNexusClient.Settings.WebServiceSuffix}",
					MethodBase.GetCurrentMethod().Name,
					memoryStream.ToArray(),
					null,
					null
				));
			}
		}

		public static Coroutine RecordException(int cmid, ChannelType channel, string version, string exceptionMessage, string stackTrace, string exceptionData, Action callback) {
			if (!NekoNexusClient.Settings.AllowTelemetry)
				return null;

			using (MemoryStream memoryStream = new MemoryStream()) {
				Int32Proxy.Serialize(memoryStream, cmid);
				EnumProxy<ChannelType>.Serialize(memoryStream, channel);
				StringProxy.Serialize(memoryStream, version);
				StringProxy.Serialize(memoryStream, exceptionMessage);
				StringProxy.Serialize(memoryStream, stackTrace);
				StringProxy.Serialize(memoryStream, exceptionData);

				return Mono.StartCoroutine(MakeRequest(
					ContractName,
					$"{NekoNexusClient.Settings.WebServicePrefix}{WebServiceName}{NekoNexusClient.Settings.WebServiceSuffix}",
					MethodBase.GetCurrentMethod().Name,
					memoryStream.ToArray(),
					null,
					null
				));
			}
		}

		public static Coroutine RemoveItemFromInventory(int itemId, string authToken, Action<int> callback, Action<Exception> handler) {
			using (MemoryStream memoryStream = new MemoryStream()) {
				Int32Proxy.Serialize(memoryStream, itemId);
				StringProxy.Serialize(memoryStream, authToken);

				return Mono.StartCoroutine(MakeRequest(
					ContractName,
					$"{NekoNexusClient.Settings.WebServicePrefix}{WebServiceName}{NekoNexusClient.Settings.WebServiceSuffix}",
					MethodBase.GetCurrentMethod().Name,
					memoryStream.ToArray(),
					(byte[] data) => {
						callback?.Invoke(Int32Proxy.Deserialize(new MemoryStream(data)));
					},
					handler
				));
			}
		}

		private static IEnumerator MakeRequest(string interfaceName, string serviceName, string methodName, byte[] data, Action<byte[]> requestCallback, Action<Exception> exceptionHandler) {
			return (IEnumerator)MakeRequest_impl.Invoke(null, new object[] { interfaceName, serviceName, methodName, data, requestCallback, exceptionHandler });
		}
	}
}
