namespace PhotonHostRuntimeInterfaces {
	// Mirrors Photon's PhotonHostRuntimeInterfaces.DisconnectReason. Paradise.Realtime
	// only forwards these values into its own OnDisconnect handlers, so the exact numeric
	// values are not protocol-critical; we keep Photon's well-known ones for familiarity.
	public enum DisconnectReason {
		ClientDisconnect = 0,
		ManagedDisconnect = 1,
		ServerDisconnect = 2,
		TimeoutDisconnect = 3,
		ConnectTimeout = 4,
		QueueFull = 5,
		ServerUserLimit = 6,
		ServerLogic = 7,
		ClientTimeout = 8,
		PluginRequest = 9,
	}
}
