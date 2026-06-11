using System;
using UnityEngine;

namespace NekoNexus.Client {
	internal class NekoNexusApplicationManager : MonoBehaviour {
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
