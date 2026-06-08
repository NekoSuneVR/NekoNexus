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
			BanPlayer,

			// Web service -> Comm server realtime notifications. The web service fires these after it
			// writes mail / clan data so the target online player's client refreshes instantly (the
			// same push model friend requests already use) instead of waiting for a manual refresh.
			NotifyInboxMessage,   // { TargetCmid, MessageId } -> SendUpdateInboxMessages
			NotifyInboxRequests,  // { TargetCmid }            -> SendUpdateInboxRequests (clan/contact invite)
			NotifyClanMembers,    // { TargetCmid }            -> SendUpdateClanMembers (roster changed)
			NotifyClanChat        // { TargetCmid, Cmid, Name, Message } -> SendClanChatMessage
		}
	}
}
