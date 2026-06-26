namespace NekoNexus {
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
			NotifyClanChat,       // { TargetCmid, Cmid, Name, Message } -> SendClanChatMessage

			// Web service -> Comm server: a player's wallet changed (admin gift / store purchase /
			// match payout) -> push the new balance to the online lobby peer so credits/coins update
			// live without relogging. { TargetCmid, Credits, Points } -> SendUpdateWallet
			NotifyWallet,

			// Web service -> Game server(s) (broadcast): set/clear the global coin+xp boost event.
			// { PointsMultiplier, XpMultiplier, EndsAt } -> stored in GameServerApplication.Boost and
			// applied at match-end scoring. EndsAt is unix ms (0 = no expiry).
			SetBoost,

			// Game server -> web service: one player's result for a finished match (saved as a
			// MatchRecord for match history). { Cmid, MatchGuid, MapId, GameMode, Kills, Deaths, Won,
			// Xp, Points }.
			MatchResult,

			// Web service -> Comm server: a player's stats changed (admin edit) -> push new xp/points
			// to the online lobby peer so level/xp/points update live. { TargetCmid, Xp, Points }.
			NotifyStats
		}
	}
}
