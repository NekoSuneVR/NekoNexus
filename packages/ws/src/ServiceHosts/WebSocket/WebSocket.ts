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

import type { PublicProfileView } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';

export enum ServerType {
  None,
  MasterServer,
  Comm,
  Game,
}

export class WebSocketInfo {
  SocketId: string;
  Type: ServerType;
  PhotonId: number;
  IsClient: boolean;

  constructor(params: Partial<WebSocketInfo> = {}) {
    Object.assign(this, params);
  }
}

export enum WebSocketState {
  Disconnected,
  Connecting,
  Connected,
  Sending,
  Receiving,
  Disconnecting,
}

export class WebSocketConnectionStatus {
  Connected: boolean;
  Rejected: boolean;
  DisconnectReason: string;

  constructor(params: Partial<WebSocketConnectionStatus> = {}) {
    Object.assign(this, params);
  }
}

export class WebSocketChatMessage {
  Cmid: number;
  Name: string;
  Message: string;
  RoomNumber: number;

  constructor(params: Partial<WebSocketChatMessage> = {}) {
    Object.assign(this, params);
  }
}

export class WebSocketCommand {
  Command: string;
  Arguments: string[];
  Invoker: PublicProfileView;

  constructor(params: Partial<WebSocketCommand> = {}) {
    Object.assign(this, params);
  }
}

export class RealtimeError {
  Type: ServerType;
  ExceptionType: any;
  Message: string;
  StackTrace: string;

  constructor(params: Partial<RealtimeError> = {}) {
    Object.assign(this, params);
  }
}
