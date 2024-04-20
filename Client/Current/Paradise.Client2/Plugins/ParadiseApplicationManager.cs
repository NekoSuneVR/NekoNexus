using System;
using UnityEngine;

namespace Paradise.Client {
	internal class ParadiseApplicationManager : MonoBehaviour {
		private DateTime lastExceptionRecord;

		void Awake() {
			Application.RegisterLogCallback(HandleException);
			DontDestroyOnLoad(gameObject);
		}

		private void OnApplicationQuit() {
			CommConnectionManager.Instance.Client.Disconnect();
			Singleton<GameStateController>.Instance.SetGameMode(null);

			System.Diagnostics.Process.GetCurrentProcess().Close();
		}

		private void HandleException(string condition, string stackTrace, LogType type) {
			if (ParadiseClient.Settings.AllowTelemetry && (type == LogType.Error || type == LogType.Exception)) {
				if (Math.Abs((lastExceptionRecord - DateTime.Now).TotalSeconds) < 5)
					return;
				lastExceptionRecord = DateTime.Now;

				ParadiseWebServiceClient.RecordException(PlayerDataManager.Cmid, condition, stackTrace, string.Empty);
			}
		}
	}
}
