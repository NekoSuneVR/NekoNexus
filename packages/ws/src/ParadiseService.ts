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

import * as models from '@festivaldev/paradise-models';
import path from 'path';
import readline, { type Interface } from 'readline';
import { Op } from 'sequelize';
import { CommandHandler, Commands, ConsoleHelper } from './console';
import Database from './Database';
import DiscordClient from './discord/DiscordClient';
import { ParadiseServiceSettings } from './ParadiseServiceSettings';
import { FileServerHost, WebServiceHost } from './ServiceHosts';
import {
  ServerType,
  WebSocketHost,
  WebSocketPacketType,
  type WebSocketCommand,
  type WebSocketConnectedEventArgs,
  type WebSocketConnectionRejectedEventArgs,
  type WebSocketDataReceivedEventArgs,
  type WebSocketDisconnectedEventArgs,
  type WebSocketPacketReceivedEventArgs,
} from './ServiceHosts/WebSocket';
import { GameSessionManager, Log, XpPointsUtil } from './utils';

export default class ParadiseService {
  private static instance: ParadiseService;

  static get Instance(): ParadiseService {
    if (!this.instance) this.instance = new this();

    return this.instance;
  }

  private runApp: boolean = true;

  ServiceSettings: ParadiseServiceSettings;
  SessionManager: GameSessionManager;

  private fileServer: FileServerHost;
  private webServiceHost: WebServiceHost;
  private discordClient: DiscordClient;
  SocketHost: WebSocketHost;

  private readlineInterface: Interface;

  private intToIPv4(ip: number): string {
    return `${ip >>> 24}.${(ip >> 16) & 255}.${(ip >> 8) & 255}.${ip & 255}`;
  }

  async Run({ serviceHost = true, prompt = true }: { serviceHost: boolean; prompt: boolean }) {
    ConsoleHelper.PrintConsoleHeader();

    Log.info(`Using environment: ${Bun.env.NODE_ENV || 'development'}`);

    this.ServiceSettings = new ParadiseServiceSettings(path.join(process.cwd(), 'Paradise.Settings.WebServices.yml'));
    this.SessionManager = new GameSessionManager();

    // #region Database Configuration
    try {
      await Database.initialize(this.ServiceSettings.DatabaseSettings);
      Log.info('Database opened.');

      const { ActivePlayer, GameRoom, PublicProfile } = models;

      await PublicProfile.destroy({
        where: {
          Name: '',
          Cmid: {
            [Op.gt]: 0,
          },
        },
      });

      await ActivePlayer.destroy({
        truncate: true,
      });

      await GameRoom.destroy({
        truncate: true,
      });
    } catch (error) {
      Log.fatal('Failed to connect to database. Please check the log for errors and try again.');
      Log.error(error);
      process.exit(1);
    }
    // #endregion

    if (serviceHost) {
      this.webServiceHost = new WebServiceHost(+this.ServiceSettings.WebServicePort!);
      await this.webServiceHost.start();

      this.fileServer = new FileServerHost(+this.ServiceSettings.FileServerPort!);
      await this.fileServer.start();

      if (this.ServiceSettings.DiscordSettings.Enabled) {
        this.discordClient = new DiscordClient();
        await this.discordClient.Connect();
      }

      this.SocketHost = new WebSocketHost(+this.ServiceSettings.SocketPort!);
      this.SocketHost.on('ConnectionRejected', (e: WebSocketConnectionRejectedEventArgs) => {
        Log.warn(
          `[Socket] Rejecting ${ServerType[e.Socket.Type]}Server(${e.Socket.Identifier}) from ${e.Socket.RemoteAddress}. Reason: ${e.Reason}`,
        );
      });

      this.SocketHost.on('ClientConnected', (e: WebSocketConnectedEventArgs) => {
        Log.info(
          `[Socket] ${ServerType[e.Socket.Type]}Server(${e.Socket.Identifier}) connected from ${e.Socket.RemoteAddress}.`,
        );
      });

      this.SocketHost.on('ClientDisconnected', (e: WebSocketDisconnectedEventArgs) => {
        Log.info(
          `[Socket] ${ServerType[e.Socket.Type]}Server(${e.Socket.Identifier}) disconnected. Reason: ${e.Reason ?? 'Connection closed'}`,
        );
      });

      this.SocketHost.on('PacketReceived', async (e: WebSocketPacketReceivedEventArgs) => {
        const { PhotonServer } = models;
        switch (e.PacketType) {
          case WebSocketPacketType.Pong:
            try {
              await PhotonServer.update(
                {
                  LastResponseTime: e.Socket.LastResponseTime,
                },
                {
                  where: {
                    PhotonId: e.Socket.Info.PhotonId,
                  },
                },
              );
            } catch (error) {
              Log.error(
                `Failed to update LastResponseTime for Photon server with id ${e.Socket.Info.PhotonId}: No database entry`,
              );
            }

            break;
          default:
            break;
        }
      });

      this.SocketHost.on('DataReceived', async (e: WebSocketDataReceivedEventArgs) => {
        const { ActivePlayer, GameRoom, PhotonServer } = models;

        switch (e.Type) {
          case WebSocketPacketType.Monitoring:
            if (e.ServerType === ServerType.Comm) {
              for (const peer of e.Data.Peers) {
                await ActivePlayer.upsert({
                  Cmid: peer.Cmid,
                  IPAddress: peer.RemoteIP,
                  Channel: peer.Channel,
                  CommServerId: (await PhotonServer.findOne({ where: { IP: peer.LocalIP, Port: peer.LocalPort } }))
                    ?.PhotonId,
                });
              }
            } else if (e.ServerType === ServerType.Game) {
              for (const room of e.Data.Rooms) {
                const [channelId, webhookUrl] = (await this.discordClient?.CreateGameRoom(room.MetaData)) || [
                  null,
                  null,
                ];

                await GameRoom.create({
                  ...room.MetaData,
                  ServerIp: this.intToIPv4(room.MetaData.Server.Ipv4),
                  ServerPort: room.MetaData.Server.Port,
                  ChannelId: channelId,
                  WebhookUrl: webhookUrl,
                });

                await ActivePlayer.update(
                  {
                    GameServerId: (
                      await PhotonServer.findOne({
                        where: { IP: room.MetaData.Server.IpAddress, Port: room.MetaData.Server.Port },
                      })
                    )?.PhotonId,
                    GameRoomId: room.RoomId,
                  },
                  {
                    where: {
                      Cmid: room.Peers,
                    },
                  },
                );
              }
            }
            break;
          case WebSocketPacketType.Error:
            await this.discordClient?.LogError(e.Data);
            break;
          case WebSocketPacketType.ChatMessage:
            await this.discordClient?.SendLobbyChatMessage(e.Data);
            break;
          case WebSocketPacketType.RoomChatMessage: {
            const [message, roomInfo] = e.Data;

            this.discordClient?.SendGameRoomMessage(message, roomInfo);

            break;
          }
          case WebSocketPacketType.Command: {
            const cmd = e.Data as WebSocketCommand;

            switch (cmd.Command) {
              case 'link': {
                if (await this.discordClient?.IsMemberLinked(cmd.Invoker.Cmid)) {
                  e.Socket.Send(
                    WebSocketPacketType.CommandOutput,
                    'Your profile has already been linked to Discord.',
                    true,
                    e.Payload.ConversationId,
                  );
                  return;
                }

                const nonce = await this.discordClient?.BeginLinkMember(cmd.Invoker.Cmid);
                e.Socket.Send(
                  WebSocketPacketType.CommandOutput,
                  `Your Discord link code is: ${nonce}.\nPlease send a DM to the Paradise Discord bot containing this code to complete the process.`,
                  true,
                  e.Payload.ConversationId,
                );
                break;
              }
              default:
                break;
            }

            break;
          }
          case WebSocketPacketType.PlayerJoined:
            await this.discordClient?.SendPlayerJoinMessage(e.Data);

            await ActivePlayer.upsert({
              Cmid: e.Data.Cmid,
              IPAddress: e.Data.RemoteIP,
              Channel: e.Data.Channel,
              CommServerId:
                e.ServerType === ServerType.Comm
                  ? (await PhotonServer.findOne({ where: { IP: e.Data.LocalIP, Port: e.Data.LocalPort } }))?.PhotonId
                  : undefined,
              GameServerId:
                e.ServerType === ServerType.Game
                  ? (await PhotonServer.findOne({ where: { IP: e.Data.LocalIP, Port: e.Data.LocalPort } }))?.PhotonId
                  : undefined,
            });
            break;
          case WebSocketPacketType.PlayerLeft:
            await this.discordClient?.SendPlayerLeftMessage(e.Data);

            if (e.ServerType === ServerType.Comm) {
              await ActivePlayer.destroy({ where: { Cmid: e.Data.Cmid } });
            } else if (e.ServerType === ServerType.Game) {
              await ActivePlayer.update({ GameServerId: null }, { where: { Cmid: e.Data.Cmid } });
            }

            break;
          case WebSocketPacketType.RoomOpened: {
            await this.discordClient?.SendGameRoomCreatedMessage(e.Data);
            const [channelId, webhookUrl] = (await this.discordClient?.CreateGameRoom(e.Data)) || [null, null];

            await GameRoom.create({
              ...e.Data,
              ServerIp: this.intToIPv4(e.Data.Server.Ipv4),
              ServerPort: e.Data.Server.Port,
              ChannelId: channelId,
              WebhookUrl: webhookUrl,
            });
            break;
          }
          case WebSocketPacketType.RoomClosed:
            await this.discordClient?.SendGameRoomDestroyedMessage(e.Data);
            await this.discordClient?.DestroyGameRoom(e.Data);

            await GameRoom.destroy({ where: { Number: e.Data.Number } });
            break;
          case WebSocketPacketType.PlayerJoinedRoom: {
            const [playerInfo, roomInfo] = e.Data;

            await this.discordClient?.GrantRoomPermissions(playerInfo, roomInfo);
            break;
          }
          case WebSocketPacketType.PlayerLeftRoom: {
            const [playerInfo, roomInfo] = e.Data;

            await this.discordClient?.RevokeRoomPermissions(playerInfo, roomInfo);
            break;
          }
          case WebSocketPacketType.RoundStarted:
            await this.discordClient?.SendRoundStartedMessage(e.Data);
            break;
          case WebSocketPacketType.RoundEnded: {
            const [roomInfo, matchEndData] = e.Data;

            await this.discordClient?.SendRoundEndedMessage(roomInfo, matchEndData);
            break;
          }
          default:
            break;
        }
      });
    }

    CommandHandler.Commands.push(...Commands);
    XpPointsUtil._initialize();

    if (prompt) {
      ConsoleHelper.PrintConsoleHeaderSubtitle();
      this.readlineInterface = readline.createInterface({
        input: process.stdin as any,
        output: process.stdout as any,
      });

      this.readlineInterface.on('SIGINT', () => {
        this.readlineInterface.close();

        process.stdout.write('\n');
        this.Teardown();
      });

      this.Prompt();
    }
  }

  async Teardown(): Promise<void> {
    this.runApp = false;

    await this.fileServer?.stop();
    await this.webServiceHost?.stop();
    await this.discordClient?.Disconnect();

    console.log('Bye.');
    setTimeout(() => {
      process.exit(0);
    }, 500);
  }

  private Prompt(): void {
    this.readlineInterface.question('> ', async (cmd) => {
      const cmdArgs =
        cmd.match(/[a-zA-Z0-9-]+|"(?:\\"|[^"])+"/g)?.map((_) => (_.match(/".+"/g) ? _.slice(1, -1) : _)) ?? [];

      if (cmdArgs.length) {
        await CommandHandler.HandleCommand(
          cmdArgs[0].toLocaleLowerCase(),
          cmdArgs.slice(1),
          undefined,
          (output: string, inline: boolean) => {
            if (!inline) {
              console.log(output);
            } else {
              process.stdout.write(output);
            }
          },
          (invoker: any, success: boolean, error?: string | undefined | null) => {
            if (success && !error?.trim().length) {
              // console.log(invoker.Output);
            } else {
              console.error(error);
            }
          },
        );
      }

      if (this.runApp) this.Prompt();
    });
  }
}
