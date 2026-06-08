/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

  // Web service -> Comm server realtime notifications (must match WebSocket.PacketType.cs).
  NotifyInboxMessage = (1 << 10) + 14,
  NotifyInboxRequests = (1 << 10) + 15,
  NotifyClanMembers = (1 << 10) + 16,
  NotifyClanChat = (1 << 10) + 17,
}

export default WebSocketPacketType;
