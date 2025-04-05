namespace Paradise {
	public partial class WebSocket {
		public enum PacketType {
			MagicBytes = 1,
			ClientInfo,
			ConnectionStatus,

			Ping,
			Pong,

			Command,
			CommandOutput,
			Monitoring,
			Error,

			ChatMessage = 1 << 10,
			RoomChatMessage,
			PlayerList,
			PlayerJoined,
			PlayerLeft,
			RoomOpened,
			RoomClosed,
			PlayerJoinedRoom,
			PlayerLeftRoom,
			RoundStarted,
			RoundEnded,

			OpenRoom,
			CloseRoom,
			BanPlayer
		}
	}
}
