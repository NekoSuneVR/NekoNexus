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
  PlayerList = (1 << 10) + 1,
  PlayerJoined = (1 << 10) + 2,
  PlayerLeft = (1 << 10) + 3,
  RoomOpened = (1 << 10) + 4,
  RoomClosed = (1 << 10) + 5,
  PlayerJoinedRoom = (1 << 10) + 6,
  PlayerLeftRoom = (1 << 10) + 7,
  RoundStarted = (1 << 10) + 8,
  RoundEnded = (1 << 10) + 9,

  OpenRoom = (1 << 10) + 10,
  CloseRoom = (1 << 10) + 11,
  BanPlayer = (1 << 10) + 12,
}

export default WebSocketPacketType;
