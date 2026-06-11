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

import NekoNexusService from '@/NekoNexusService';
import { Log } from '@/utils';
import { ArrayProxy, ByteProxy, EnumProxy, Int32Proxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import type { Server } from 'bun';
import EventEmitter from 'events';
import httpStatus from 'http-status';
import WebSocketConnection from './Connection';
import {
  WebSocketConnectedEventArgs,
  WebSocketConnectionRejectedEventArgs,
  WebSocketDataReceivedEventArgs,
  WebSocketDisconnectedEventArgs,
  WebSocketPacketReceivedEventArgs,
} from './EventArgs';
import PacketType from './PacketType';
import WebSocketPayload from './Payload';
import RijndaelCryptoProvider from './RijndaelCryptoProvider';
import { ServerType, WebSocketConnectionStatus, WebSocketInfo } from './WebSocket';

const MAGIC_BYTES = [0x50, 0x61, 0x52, 0x61, 0x44, 0x69, 0x53, 0x65];

export default class WebSocketHost extends EventEmitter {
  readonly port: number;

  readonly socket: Server;

  private CommServer?: WebSocketConnection;
  private GameServers: WebSocketConnection[] = [];

  private ConnectedSockets: { [key: string]: WebSocketConnection } = {};
  private CryptoProviders: { [key: string]: RijndaelCryptoProvider } = {};

  constructor(port: number = 8080) {
    super();

    Log.info('Starting WebSocket...');

    this.port = port;

    this.socket = Bun.serve<{ socketId: string }>({
      hostname: NekoNexusService.Instance.ServiceSettings.Hostname ?? '0.0.0.0',
      port: this.port,
      fetch: (req, server) =>
        server.upgrade(req, {
          data: {
            socketId: crypto.randomUUID(),
          },
        })
          ? undefined
          : new Response(null, { status: httpStatus.BAD_REQUEST }),
      websocket: {
        open: (ws) => {
          const socketClient = new WebSocketConnection({
            ConnectionId: ws.data.socketId,
            Socket: ws,
            Info: new WebSocketInfo({
              IsClient: true,
            }),
          });

          this.ConnectedSockets[socketClient.ConnectionId] = socketClient;

          socketClient.SendPacket(PacketType.MagicBytes);
        },
        message: async (ws, message) => {
          if (Object.keys(this.ConnectedSockets).includes(ws.data.socketId)) {
            const socketClient = this.ConnectedSockets[ws.data.socketId];
            const inputBytes = [...(message as Buffer)];

            const payloadType = Int32Proxy.Deserialize(inputBytes);
            if (payloadType === 0x42) {
              // Packet / Raw Data
              const packetType = EnumProxy.Deserialize<PacketType>(inputBytes);
              switch (packetType) {
                case PacketType.MagicBytes: {
                  const magicBytes = ArrayProxy.Deserialize<number>(inputBytes, ByteProxy.Deserialize);

                  if (
                    !magicBytes.length ||
                    ![...magicBytes].reverse().every((val, index) => val === MAGIC_BYTES[index])
                  ) {
                    ws.close();
                    delete this.ConnectedSockets[ws.data.socketId];
                  }

                  socketClient.SendPacket(PacketType.ClientInfo);
                  break;
                }
                case PacketType.Pong:
                  socketClient.ResetPingTimeout();
                  break;
                default:
                  break;
              }

              this.emit(
                'PacketReceived',
                new WebSocketPacketReceivedEventArgs({
                  Socket: socketClient,
                  PacketType: packetType,
                }),
              );
            } else {
              // JSON Object
              const [payload, payloadObj] = WebSocketPayload.Decode<any>(
                message.toString('utf-8'),
                socketClient.CryptoProvider,
              );

              if (!payloadObj) return;

              switch (payloadObj.Type) {
                case PacketType.ClientInfo: {
                  const clientInfo = payload! as WebSocketInfo;

                  socketClient.Info = clientInfo;
                  socketClient.Info.IsClient = true;

                  const passphrase = NekoNexusService.Instance.ServiceSettings.ServerCredentials.find(
                    (_) => _.Id.toLowerCase() === socketClient.Identifier.toLowerCase(),
                  )?.Passphrase.trim();

                  if (!passphrase || !passphrase.length) {
                    socketClient.DisconnectReason = 'Unknown server';

                    this.emit(
                      'ConnectionRejected',
                      new WebSocketConnectionRejectedEventArgs({
                        Info: clientInfo,
                        Socket: socketClient,
                        Reason: socketClient.DisconnectReason,
                      }),
                    );

                    await socketClient.Send(
                      PacketType.ConnectionStatus,
                      new WebSocketConnectionStatus({
                        Connected: false,
                        Rejected: true,
                        DisconnectReason: socketClient.DisconnectReason,
                      }),
                      true,
                      payloadObj.ConversationId,
                    );

                    return;
                  }

                  switch (clientInfo.Type) {
                    case ServerType.Comm:
                      if (this.CommServer) {
                        socketClient.DisconnectReason = 'Cannot register more than one Comm Server';

                        this.emit(
                          'ConnectionRejected',
                          new WebSocketConnectionRejectedEventArgs({
                            Info: clientInfo,
                            Socket: socketClient,
                            Reason: socketClient.DisconnectReason,
                          }),
                        );

                        await socketClient.Send(
                          PacketType.ConnectionStatus,
                          new WebSocketConnectionStatus({
                            Connected: false,
                            Rejected: true,
                            DisconnectReason: socketClient.DisconnectReason,
                          }),
                          true,
                          payloadObj.ConversationId,
                        );

                        return;
                      }

                      this.CommServer = socketClient;

                      break;
                    case ServerType.Game:
                      if (this.GameServers.find((_) => _.Identifier === socketClient.Identifier)) {
                        socketClient.DisconnectReason = 'Duplicate server identifier';

                        this.emit(
                          'ConnectionRejected',
                          new WebSocketConnectionRejectedEventArgs({
                            Info: clientInfo,
                            Socket: socketClient,
                            Reason: socketClient.DisconnectReason,
                          }),
                        );

                        await socketClient.Send(
                          PacketType.ConnectionStatus,
                          new WebSocketConnectionStatus({
                            Connected: false,
                            Rejected: true,
                            DisconnectReason: socketClient.DisconnectReason,
                          }),
                          true,
                          payloadObj.ConversationId,
                        );

                        return;
                      }

                      this.GameServers.push(socketClient);

                      break;
                    default:
                      socketClient.DisconnectReason = 'Invalid server type';

                      this.emit(
                        'ConnectionRejected',
                        new WebSocketConnectionRejectedEventArgs({
                          Info: clientInfo,
                          Socket: socketClient,
                          Reason: socketClient.DisconnectReason,
                        }),
                      );

                      await socketClient.Send(
                        PacketType.ConnectionStatus,
                        new WebSocketConnectionStatus({
                          Connected: false,
                          Rejected: true,
                          DisconnectReason: socketClient.DisconnectReason,
                        }),
                        true,
                        payloadObj.ConversationId,
                      );

                      return;
                  }

                  this.ConnectedSockets[socketClient.ConnectionId] = socketClient;

                  const uuidByteArray = [...Buffer.from(socketClient.Info.SocketId.replaceAll('-', ''), 'hex')];
                  const uuidBytes = Buffer.from(
                    uuidByteArray
                      .slice(0, 4)
                      .reverse()
                      .concat(uuidByteArray.slice(4, 6).reverse())
                      .concat(uuidByteArray.slice(6, 8).reverse())
                      .concat(uuidByteArray.slice(8)),
                  );
                  this.CryptoProviders[socketClient.ConnectionId] = new RijndaelCryptoProvider(
                    Buffer.from(passphrase, 'utf-8'),
                    uuidBytes,
                    uuidBytes,
                  );
                  socketClient.CryptoProvider = this.CryptoProviders[socketClient.ConnectionId];

                  this.emit(
                    'ClientConnected',
                    new WebSocketConnectedEventArgs({
                      Socket: socketClient,
                    }),
                  );

                  socketClient.OnOpen();

                  await socketClient.Send(
                    PacketType.ConnectionStatus,
                    new WebSocketConnectionStatus({
                      Connected: true,
                    }),
                    true,
                    payloadObj.ConversationId,
                  );

                  break;
                }
                default:
                  break;
              }

              this.emit(
                'DataReceived',
                new WebSocketDataReceivedEventArgs({
                  Socket: socketClient,
                  Payload: payloadObj,
                  Data: payload,
                  ServerType: socketClient.Info.Type,
                }),
              );
            }
          }
        },
        close: (ws, code, reason) => {
          try {
            if (Object.keys(this.ConnectedSockets).includes(ws.data.socketId)) {
              const socketClient = this.ConnectedSockets[ws.data.socketId];
              socketClient.OnClose();

              delete this.ConnectedSockets[socketClient.ConnectionId];

              switch (socketClient.Type) {
                case ServerType.Comm:
                  if (this.CommServer && this.CommServer.ConnectionId === socketClient.ConnectionId) {
                    this.CommServer = undefined;
                  }
                  break;

                case ServerType.Game:
                  if (this.GameServers.includes(socketClient)) {
                    this.GameServers = this.GameServers.filter((_) => _ !== socketClient);
                  }
                  break;

                default:
                  break;
              }

              if (Object.keys(this.CryptoProviders).includes(socketClient.ConnectionId)) {
                delete this.CryptoProviders[socketClient.ConnectionId];
              }

              this.emit(
                'ClientDisconnected',
                new WebSocketDisconnectedEventArgs({
                  Info: socketClient.Info,
                  Socket: socketClient,
                  Reason: socketClient.DisconnectReason,
                }),
              );

              ws.close();
            }
          } catch (e: any) {
            Log.error(e);
          }
        },
      },
    });

    Log.info(`WebSocket listening on ${this.socket.hostname}:${this.socket.port}.`);
  }

  // #region Send
  async SendToCommServer(
    type: PacketType,
    payload: any,
    oneWay: boolean = true,
    conversationId?: string,
  ): Promise<any> {
    if (!this.CommServer) return null;

    const r = await this.CommServer.Send(type, payload, oneWay, conversationId, ServerType.MasterServer);
    return r;
  }

  async SendToGameServer(
    guid: string,
    type: PacketType,
    payload: any,
    oneWay: boolean = true,
    conversationId?: string,
  ): Promise<any> {
    if (!this.GameServers.find((_) => _.Identifier === guid)) return null;

    const r = await this.GameServers.find((_) => _.Identifier === guid)?.Send(
      type,
      payload,
      oneWay,
      conversationId,
      ServerType.MasterServer,
    );
    return r;
  }

  SendToGameServers(type: PacketType, payload: any): void {
    // Sending to game servers is one-way only

    for (const server of this.GameServers) {
      server.Send(type, payload, true);
    }
  }
  // #endregion
}
