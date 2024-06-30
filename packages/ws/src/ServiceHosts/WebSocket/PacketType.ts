enum WebSocketPacketType {
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
  RoomChatMessage = (1 << 10) + 1,
  PlayerList = (1 << 10) + 2,
  PlayerJoined = (1 << 10) + 3,
  PlayerLeft = (1 << 10) + 4,
  RoomOpened = (1 << 10) + 5,
  RoomClosed = (1 << 10) + 6,
  PlayerJoinedRoom = (1 << 10) + 7,
  PlayerLeftRoom = (1 << 10) + 8,
  RoundStarted = (1 << 10) + 9,
  RoundEnded = (1 << 10) + 10,

  OpenRoom = (1 << 10) + 11,
  CloseRoom = (1 << 10) + 12,
  BanPlayer = (1 << 10) + 13,
}

export default WebSocketPacketType;
