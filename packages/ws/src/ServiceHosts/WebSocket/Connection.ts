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

import { EnumProxy, Int32Proxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import type { ServerWebSocket } from 'bun';
import { WebSocket } from 'ws';
import PacketType from './PacketType';
import WebSocketPayload from './Payload';
import RijndaelCryptoProvider from './RijndaelCryptoProvider';
import { ServerType, WebSocketInfo, WebSocketState } from './WebSocket';

const CONNECT_TIMEOUT = 5;
const RECONNECT_INTERVAL = 10;
const MAX_RECONNECT = 10;
const SEND_TIMEOUT = 3;
const RECEIVE_TIMEOUT = 3;
const PING_INTERVAL = 10;

export default class WebSocketConnection {
  ConnectionId: string;
  Socket: ServerWebSocket<{ socketId: string }>;
  Info: WebSocketInfo;
  CryptoProvider: RijndaelCryptoProvider;
  DisconnectReason: string;
  LastResponseTime: Date;

  private sendTask?: Promise<void>;
  private receiveTask?: Promise<void>;

  private pingTask?: ReturnType<typeof setInterval>;
  private pingDisconnect?: ReturnType<typeof setTimeout>;

  constructor(params: Partial<WebSocketConnection> = {}) {
    Object.assign(this, params);
  }

  private connectionState: WebSocketState = WebSocketState.Disconnected;
  get ConnectionState(): WebSocketState {
    return this.connectionState;
  }

  private set ConnectionState(value: WebSocketState) {
    this.connectionState = value;
  }

  get RemoteAddress(): string | undefined {
    return this.Socket.remoteAddress || 'undefined';
  }

  get Identifier(): string {
    return this.Info.SocketId;
  }

  get Type(): ServerType {
    return this.Info.Type;
  }

  get IsConnected(): boolean {
    return this.Socket.readyState === WebSocket.OPEN;
  }

  async SendBytes(bytes: Buffer | number[] | Uint8Array) {
    if (!this.IsConnected) return;

    if (this.sendTask) await this.sendTask;
    if (this.receiveTask) await this.receiveTask;

    try {
      this.ConnectionState = WebSocketState.Sending;

      // this.sendTask = new Promise((resolve, reject) => {
      //   const timer = setTimeout(() => {
      //     this.sendTask = undefined;
      //     reject(new Error(`Failed to send data within ${SEND_TIMEOUT} second(s).`));
      //   }, SEND_TIMEOUT * 1000);
      //   this.Socket.send(Buffer.from(bytes), {}, (error) => {
      //     clearTimeout(timer);
      //     if (error) return reject(error);
      //     return resolve();
      //   });
      // });

      // await this.sendTask;
      // this.sendTask = undefined;

      this.Socket.sendBinary(Buffer.from(bytes));

      this.ConnectionState = WebSocketState.Connected;
    } catch {}
  }

  async SendPacket(type: PacketType) {
    const bytes: number[] = [];

    Int32Proxy.Serialize(bytes, 0x42);
    EnumProxy.Serialize<PacketType>(bytes, type);

    await this.SendBytes(bytes);
  }

  // eslint-disable-next-line consistent-return
  async Send(
    type: PacketType,
    payload: any,
    oneWay: boolean = true,
    conversationId: string | null = null,
    serverType: ServerType = ServerType.None,
  ) {
    const [bytes, payloadObj] = WebSocketPayload.Encode(
      type,
      payload,
      this.CryptoProvider,
      oneWay,
      conversationId,
      serverType,
    );
    await this.SendBytes(bytes!);

    if (oneWay) return null;
  }

  OnOpen(): void {
    this.pingTask = setInterval(() => {
      this.SendPacket(PacketType.Ping);

      this.pingDisconnect = setTimeout(() => {
        this.Socket.close();
      }, RECEIVE_TIMEOUT * 1000);
    }, PING_INTERVAL * 1000);
  }

  OnClose(): void {
    clearInterval(this.pingTask);
  }

  ResetPingTimeout(): void {
    this.LastResponseTime = new Date();
    clearTimeout(this.pingDisconnect);
  }
}
