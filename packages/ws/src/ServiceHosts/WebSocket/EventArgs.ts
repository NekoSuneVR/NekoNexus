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

import type WebSocketConnection from './Connection';
import type WebSocketPacketType from './PacketType';
import type WebSocketPayload from './Payload';
import type { ServerType, WebSocketInfo } from './WebSocket';

export class WebSocketConnectedEventArgs {
  Socket: WebSocketConnection;

  constructor(params: Partial<WebSocketConnectedEventArgs> = {}) {
    Object.assign(this, params);
  }
}

export class WebSocketDisconnectedEventArgs {
  Info: WebSocketInfo;
  Socket: WebSocketConnection;
  Code: number;
  Reason: string;

  constructor(params: Partial<WebSocketDisconnectedEventArgs> = {}) {
    Object.assign(this, params);
  }
}

export class WebSocketDataReceivedEventArgs {
  Socket: WebSocketConnection;
  BytesReceived: number;

  Payload: WebSocketPayload;
  Data: any;
  ServerType: ServerType;

  constructor(params: Partial<WebSocketDataReceivedEventArgs> = {}) {
    Object.assign(this, params);
  }

  get Type(): WebSocketPacketType {
    return this.Payload.Type;
  }
}

export class WebSocketPacketReceivedEventArgs {
  Socket: WebSocketConnection;
  PacketType: WebSocketPacketType;

  constructor(params: Partial<WebSocketPacketReceivedEventArgs> = {}) {
    Object.assign(this, params);
  }
}

export class WebSocketDataSentEventArgs {
  Socket: WebSocketConnection;
  BytesSent: number;

  constructor(params: Partial<WebSocketDataSentEventArgs> = {}) {
    Object.assign(this, params);
  }
}

export class WebSocketConnectionRejectedEventArgs {
  Info: WebSocketInfo;
  Socket: WebSocketConnection;
  Reason: string;

  constructor(params: Partial<WebSocketConnectionRejectedEventArgs> = {}) {
    Object.assign(this, params);
  }
}

export class WebSocketStateChangedEventArgs {
  Socket: WebSocket;
  // State: SocketState;

  constructor(params: Partial<WebSocketStateChangedEventArgs> = {}) {
    Object.assign(this, params);
  }
}
