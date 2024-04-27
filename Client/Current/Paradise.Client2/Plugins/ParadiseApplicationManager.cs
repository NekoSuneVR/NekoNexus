using System;
using UnityEngine;

namespace Paradise.Client {
	internal class ParadiseApplicationManager : MonoBehaviour {
		private DateTime lastExceptionRecord;

		void Awake() {
			DontDestroyOnLoad(gameObject);
		}

		private void OnApplicationQuit() {
			CommConnectionManager.Instance.Client.Disconnect();
			Singleton<GameStateController>.Instance.SetGameMode(null);

			System.Diagnostics.Process.GetCurrentProcess().Close();
		}
	}
}
