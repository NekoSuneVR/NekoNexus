import ParadiseService from '@/ParadiseService';
import { RealtimeError, WebSocketChatMessage } from '@/ServiceHosts/WebSocket';
import PacketType from '@/ServiceHosts/WebSocket/PacketType';
import { CommandHandler } from '@/console';
import { Log } from '@/utils';
import models, { DiscordUser } from '@festivaldev/paradise-models';
import { MemberAccessLevel, PhotonUsageType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  CommActorInfo,
  EndOfMatchData,
  GameActorInfo,
  GameRoomData,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Models';
import { GameModeType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import crypto from 'crypto';
import {
  ActivityType,
  CategoryChannel,
  ChannelType,
  Client,
  Colors,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  Message,
  Partials,
  TextChannel,
  WebhookClient,
} from 'discord.js';
import { Op } from 'sequelize';
import { DiscordSettings } from './DiscordSettings';

enum GAME_FLAGS {
  None = 0x0,
  LowGravity = 0x1,
  NoArmor = 0x2,
  QuickSwitch = 0x4,
  MeleeOnly = 0x8,
}

export default class DiscordClient {
  private discordSettings: DiscordSettings;
  private discordClient: Client;

  private lobbyChatClient?: WebhookClient;
  private playerAnnouncementClient?: WebhookClient;
  private gameRoomAnnouncementClient?: WebhookClient;
  private gameRoundAnnouncementClient?: WebhookClient;
  private errorLogClient?: WebhookClient;

  private roomChatChannels: { [key: string]: TextChannel } = {};
  private roomChatClients: { [key: string]: WebhookClient } = {};
  private roomChatCreationPromises: { [key: string]: any } = {};
  private roomChatMap: { [key: string]: number } = {};

  public async Connect(): Promise<void> {
    if (this.discordClient) return;
    Log.info('Connecting to Discord...');

    this.discordSettings = ParadiseService.Instance.ServiceSettings.DiscordSettings;

    this.discordClient = new Client({
      intents: [
        // #region AllUnprivileged
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        // #endregion
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Channel, Partials.Message],
    });

    const loginPromise = new Promise<void>((resolve, reject) => {
      this.discordClient.once(Events.ClientReady, (e) => {
        this.OnReady(e);
        resolve();
      });
    });

    this.discordClient.on(Events.MessageCreate, this.OnMessageCreate.bind(this));

    this.discordClient.login(this.discordSettings.BotToken);
    await loginPromise;

    if (this.discordSettings.Integrations.LobbyChat && this.discordSettings.WebHooks.LobbyChat?.trim().length) {
      this.lobbyChatClient = new WebhookClient({ url: this.discordSettings.WebHooks.LobbyChat });
    }

    if (
      (this.discordSettings.Integrations.PlayerJoinAnnouncements ||
        this.discordSettings.Integrations.PlayerLeaveAnnouncements) &&
      this.discordSettings.WebHooks.PlayerAnnouncements?.trim().length
    ) {
      this.playerAnnouncementClient = new WebhookClient({ url: this.discordSettings.WebHooks.PlayerAnnouncements });
    }

    if (
      (this.discordSettings.Integrations.RoomOpenAnnouncements ||
        this.discordSettings.Integrations.RoomCloseAnnouncements) &&
      this.discordSettings.WebHooks.RoomAnnouncements?.trim().length
    ) {
      this.gameRoomAnnouncementClient = new WebhookClient({ url: this.discordSettings.WebHooks.RoomAnnouncements });
    }

    if (
      (this.discordSettings.Integrations.RoundStartAnnouncements ||
        this.discordSettings.Integrations.RoundEndAnnouncements) &&
      this.discordSettings.WebHooks.RoundAnnouncements?.trim().length
    ) {
      this.gameRoundAnnouncementClient = new WebhookClient({ url: this.discordSettings.WebHooks.RoundAnnouncements });
    }

    if (this.discordSettings.Integrations.ErrorLog && this.discordSettings.WebHooks.ErrorLog?.trim().length) {
      this.errorLogClient = new WebhookClient({ url: this.discordSettings.WebHooks.ErrorLog });
    }
  }

  public async Disconnect(): Promise<void> {
    await this.discordClient.user?.setStatus('invisible');
  }

  public async SendLobbyChatMessage(message: WebSocketChatMessage): Promise<void> {
    if (!this.discordSettings.Integrations.LobbyChat) return;
    if (!this.discordSettings.ChatChannelId) return;

    const discordUser = await this.GetDiscordUserFromCmid(message.Cmid);
    let username: string | null = null;
    let avatarUrl: string | null = null;

    if (discordUser && discordUser.DiscordUserId) {
      const guild = await this.discordClient.guilds.fetch(this.discordSettings.GuildId);
      const user = await guild.members.fetch(discordUser.DiscordUserId);

      if (user) {
        username = user.nickname || user.user.globalName || user.user.username;
        avatarUrl = user.displayAvatarURL();
      }
    }

    const embed = new EmbedBuilder({
      description: message.Message.replace(/(_|\*|~|`|\||\\)/g, '\\$1'),
      footer: {
        text: 'UberStrike Lobby Chat',
        icon_url: this.discordClient.user?.avatarURL()!,
      },
    });

    await this.lobbyChatClient?.send({
      username: username ?? message.Name,
      avatarURL: avatarUrl ?? undefined,
      embeds: [embed],
    });
  }

  public async SendPlayerJoinMessage(player: CommActorInfo): Promise<void> {
    const { PublicProfile, SteamMember } = models;

    if (!this.discordSettings.Integrations.PlayerJoinAnnouncements) return;
    if (this.discordSettings.AnnouncementBlacklist.includes(player.Cmid.toString())) return;

    const publicProfile = await PublicProfile.findOne({
      where: {
        Cmid: player.Cmid,
      },
    });

    const steamMember = await SteamMember.findOne({
      where: {
        Cmid: player.Cmid,
      },
    });

    if (!publicProfile || !steamMember) return;

    const embed = new EmbedBuilder({
      title: 'Player connected',
      description: `${publicProfile.Name} has joined the game.`,
      color: Colors.Green,
    });

    embed.addFields(
      { name: 'CMID', value: player.Cmid.toString() },
      { name: 'SteamID64', value: steamMember.SteamId.toString(), inline: true },
      { name: 'Machine ID', value: steamMember.MachineId },
      { name: 'Rank', value: MemberAccessLevel[publicProfile.AccessLevel] },
    );

    await this.playerAnnouncementClient?.send({
      avatarURL: this.discordClient.user!.avatarURL() ?? undefined,
      username: 'UberStrike',
      embeds: [embed],
    });
  }

  public async SendPlayerLeftMessage(player: CommActorInfo): Promise<void> {
    const { PublicProfile } = models;

    if (!this.discordSettings.Integrations.PlayerLeaveAnnouncements) return;
    if (this.discordSettings.AnnouncementBlacklist.includes(player.Cmid.toString())) return;

    const publicProfile = await PublicProfile.findOne({
      where: {
        Cmid: player.Cmid,
      },
    });

    if (!publicProfile) return;

    const embed = new EmbedBuilder({
      title: 'Player disconnected',
      description: `${publicProfile.Name} has left the game.`,
      color: Colors.Red,
    });

    await this.playerAnnouncementClient?.send({
      avatarURL: this.discordClient.user!.avatarURL() ?? undefined,
      username: 'UberStrike',
      embeds: [embed],
    });
  }

  public async CreateGameRoom(metadata: GameRoomData): Promise<[string | null, string | null]> {
    if (!this.discordSettings.Integrations.RoomChats) return [null, null];

    let _resolve: Function | undefined;
    this.roomChatCreationPromises[metadata.Number] = new Promise<void>((resolve, reject) => {
      _resolve = resolve;
    });

    const category: CategoryChannel = (await this.discordClient.channels.fetch(
      this.discordSettings.RoomChatCategory,
    )) as CategoryChannel;

    if (!category) {
      Log.error(
        `Failed to create a channel for room ${metadata.Number}: No category for id ${this.discordSettings.RoomChatCategory}`,
      );
      return [null, null];
    }
    let channel: TextChannel = category.children.cache.find(
      (_) => _.name === `${metadata.Name}-${metadata.Number}`,
    ) as TextChannel;

    if (!channel) {
      channel = (await category.children.create({
        name: `${metadata.Name}-${metadata.Number}`,
        type: ChannelType.GuildText,
      })) as TextChannel;

      channel.permissionOverwrites.create(channel.guild.roles.cache.find((_) => _.name === 'Bot')!, {
        ViewChannel: true,
      });
      channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });
    }

    this.roomChatChannels[metadata.Number] = channel;
    this.roomChatMap[channel.id] = metadata.Number;

    let webhook = (await channel.fetchWebhooks())?.first();

    if (!webhook) {
      webhook = await channel.createWebhook({
        name: 'UberStrike',
        avatar: this.discordClient.user!.avatarURL(),
      });
    }

    this.roomChatClients[metadata.Number] = new WebhookClient({ id: webhook.id, token: webhook.token! });

    _resolve?.();
    delete this.roomChatCreationPromises[metadata.Number];

    return [channel.id, this.roomChatClients[metadata.Number].url];
  }

  public async DestroyGameRoom(metadata: GameRoomData): Promise<void> {
    if (!this.discordSettings.Integrations.RoomChats) return;

    await this.roomChatChannels[metadata.Number]?.delete();
    delete this.roomChatChannels[metadata.Number];
    delete this.roomChatClients[metadata.Number];
  }

  public async GrantRoomPermissions(playerInfo: GameActorInfo, metadata: GameRoomData): Promise<void> {
    if (!this.discordSettings.Integrations.RoomChats) return;

    if (this.roomChatCreationPromises[metadata.Number]) {
      await this.roomChatCreationPromises[metadata.Number];
    }

    const discordUser = await this.GetDiscordUserFromCmid(playerInfo.Cmid);
    if (!discordUser || !discordUser.DiscordUserId) return;

    const discordMember = await this.roomChatChannels[metadata.Number]?.guild.members.fetch(discordUser.DiscordUserId);
    if (!discordMember) return;

    this.roomChatChannels[metadata.Number]?.permissionOverwrites.create(discordMember, { ViewChannel: true });
  }

  public async RevokeRoomPermissions(playerInfo: GameActorInfo, metadata: GameRoomData): Promise<void> {
    if (!this.discordSettings.Integrations.RoomChats) return;

    if (this.roomChatCreationPromises[metadata.Number]) {
      await this.roomChatCreationPromises[metadata.Number];
    }

    const discordUser = await DiscordUser.findOne({ where: { Cmid: playerInfo.Cmid } });
    if (!discordUser || !discordUser.DiscordUserId) return;

    const discordMember = await this.roomChatChannels[metadata.Number]?.guild.members.fetch(discordUser.DiscordUserId);
    if (!discordMember) return;

    this.roomChatChannels[metadata.Number]?.permissionOverwrites.delete(discordMember);
  }

  public async SendGameRoomMessage(message: WebSocketChatMessage, metadata: GameRoomData): Promise<void> {
    if (!this.discordSettings.Integrations.RoomChats) return;

    if (this.roomChatCreationPromises[metadata.Number]) {
      await this.roomChatCreationPromises[metadata.Number];
    }
    if (!this.roomChatChannels[metadata.Number] || !this.roomChatClients[metadata.Number]) return;

    const discordUser = await this.GetDiscordUserFromCmid(message.Cmid);
    let username: string | null = null;
    let avatarUrl: string | null = null;

    if (discordUser && discordUser.DiscordUserId) {
      const user = await this.roomChatChannels[metadata.Number]?.guild.members.fetch(discordUser.DiscordUserId);

      if (user) {
        username = user.nickname || user.user.globalName || user.user.username;
        avatarUrl = user.displayAvatarURL();
      }
    }

    const embed = new EmbedBuilder({
      description: message.Message.replace(/(_|\*|~|`|\||\\)/g, '\\$1'),
      footer: {
        text: 'UberStrike Game Chat',
        icon_url: this.discordClient.user?.avatarURL()!,
      },
    });

    await this.roomChatClients[metadata.Number]?.send({
      username: username ?? message.Name,
      avatarURL: avatarUrl ?? undefined,
      embeds: [embed],
    });
  }

  public async SendGameRoomCreatedMessage(metadata: GameRoomData): Promise<void> {
    if (!this.discordSettings.Integrations.RoomOpenAnnouncements) return;

    const embed = new EmbedBuilder({
      title: 'Game Room created',
      color: Colors.Default,
      image: {
        url: `https://static.paradise.festival.tf/images/maps/${this.GetImageNameForMapID(metadata.MapID)}.jpg`,
      },
      footer: {
        text: `Room ID: ${metadata.Number}`,
      },
    });

    try {
      embed.addFields(
        { name: 'Room Name', value: metadata.Name },
        { name: 'Map', value: this.GetNameForMapID(metadata.MapID), inline: true },
        { name: 'Gamemode', value: this.GetGamemodeName(metadata.GameMode), inline: true },
        { name: 'Player Limit', value: metadata.PlayerLimit.toString(), inline: true },
        { name: 'Time Limit', value: `${metadata.TimeLimit / 60} min`, inline: true },
        { name: 'Kill/Round Limit', value: metadata.KillLimit.toString(), inline: true },
        { name: 'Game Modifiers', value: this.GetGameFlags(metadata.GameFlags) },
        { name: 'Requires Password', value: metadata.IsPasswordProtected ? 'Yes' : 'No', inline: true },
        { name: 'Minimum Level', value: metadata.LevelMin > 0 ? metadata.LevelMin.toString() : 'None', inline: true },
        { name: 'Maximum Level', value: metadata.LevelMax > 0 ? metadata.LevelMax.toString() : 'None', inline: true },
        {
          name: 'Join this game',
          value: `uberstrike://connect/${metadata.Server.ConnectionString}/${metadata.Number}`,
        },
      );

      await this.gameRoomAnnouncementClient?.send({
        avatarURL: this.discordClient.user!.avatarURL() ?? undefined,
        username: 'UberStrike',
        embeds: [embed],
      });
    } catch (e: any) {
      Log.error(e);
      Log.info(
        JSON.stringify(
          embed.data.fields?.map((_) => ({
            Name: _.name,
            Value: _.value,
          })),
          null,
          4,
        ),
      );
    }
  }

  public async SendGameRoomDestroyedMessage(metadata: GameRoomData): Promise<void> {
    if (!this.discordSettings.Integrations.RoomCloseAnnouncements) return;

    const embed = new EmbedBuilder({
      title: 'Game Room closed',
      color: Colors.Default,
      footer: {
        text: `Room ID: ${metadata.Number}`,
      },
    });

    try {
      embed.addFields(
        { name: 'Room Name', value: metadata.Name },
        { name: 'Map', value: this.GetNameForMapID(metadata.MapID), inline: true },
        { name: 'Gamemode', value: this.GetGamemodeName(metadata.GameMode), inline: true },
      );

      await this.gameRoomAnnouncementClient?.send({
        avatarURL: this.discordClient.user!.avatarURL() ?? undefined,
        username: 'UberStrike',
        embeds: [embed],
      });
    } catch (e: any) {
      Log.error(e);
      Log.info(
        JSON.stringify(
          embed.data.fields?.map((_) => ({
            Name: _.name,
            Value: _.value,
          })),
          null,
          4,
        ),
      );
    }
  }

  public async SendRoundStartedMessage(metadata: GameRoomData): Promise<void> {
    Log.debug('Round start messages not implemented');
  }

  public async SendRoundEndedMessage(metadata: GameRoomData, matchData: EndOfMatchData): Promise<void> {
    Log.debug('Round end messages not implemented');
  }

  public async LogError(error: Error | RealtimeError): Promise<void> {
    if (!this.discordSettings.Integrations.ErrorLog) return;

    if (error instanceof Error) {
      await this.errorLogClient?.send({
        username: 'UberStrike',
        content: `\`\`\`${error.message}\r\n${error.stack}\`\`\``,
      });
    } else if (error instanceof RealtimeError) {
      await this.errorLogClient?.send({
        username: 'UberStrike',
        content: `\`\`\`${error.ExceptionType}: ${error.Message}\r\n${error.StackTrace}\`\`\``,
      });
    }
  }

  public async IsMemberLinked(cmid: number): Promise<boolean> {
    const link = await DiscordUser.findOne({
      where: {
        Cmid: cmid,
        DiscordUserId: {
          [Op.ne]: null,
        },
        Completed: true,
      },
    });

    return !!link;
  }

  public async BeginLinkMember(cmid: number): Promise<string | null> {
    if (await this.IsMemberLinked(cmid)) return null;

    let link = await DiscordUser.findOne({
      where: {
        Cmid: cmid,
        Nonce: {
          [Op.ne]: null,
        },
        Completed: false,
      },
    });

    if (link) return link.Nonce;

    const nonce = crypto.randomBytes(4).toString('hex');
    link = await DiscordUser.create({
      Cmid: cmid,
      Nonce: nonce,
    });

    return link.Nonce;
  }

  public async GetDiscordUserFromCmid(cmid: number): Promise<DiscordUser | null> {
    return DiscordUser.findOne({
      where: {
        Cmid: cmid,
        DiscordUserId: {
          [Op.ne]: null,
        },
      },
    });
  }

  public async GetDiscordUserFromDiscordId(discordUserId: string): Promise<DiscordUser | null> {
    return DiscordUser.findOne({
      where: {
        Cmid: {
          [Op.gt]: 0,
        },
        DiscordUserId: discordUserId,
      },
    });
  }

  // #region Callbacks
  private async OnReady(readyClient: Client<boolean>): Promise<void> {
    Log.info(`Connected to Discord as ${readyClient.user?.tag}`);
    await readyClient.user!.setPresence({
      activities: [
        {
          name: 'Paradise Web Services TEST',
          type: ActivityType.Playing,
        },
      ],
      status: 'online',
    });
  }

  private async OnMessageCreate(message: Message): Promise<void> {
    const { GameRoom, PhotonServer, PublicProfile } = models;

    if (message.author.bot || message.webhookId) return;

    if (message.channel.isDMBased()) {
      let discordUser = await this.GetDiscordUserFromDiscordId(message.author.id);

      if (discordUser) {
        await message.reply('Your Discord profile has already been linked to UberStrike.');
        return;
      }

      discordUser = await DiscordUser.findOne({ where: { Nonce: message.cleanContent } });

      if (!discordUser) {
        await message.reply(
          'Your Discord profile could not be linked to UberStrike.\nPlease make sure to enter a valid link code.',
        );
        return;
      }

      discordUser.update({
        DiscordUserId: message.author.id,
        Nonce: null,
        Completed: true,
      });

      await message.reply('Your Discord profile has been successfully linked to UberStrike!');
    } else if (message.channel.isTextBased()) {
      if (
        message.channel.id === this.discordSettings.CommandChannelId &&
        message.cleanContent.startsWith('?') &&
        message.cleanContent.length > 1
      ) {
        const discordUser = await this.GetDiscordUserFromDiscordId(message.author.id);

        if (!discordUser) {
          await message.reply(
            'Please link your Discord profile to UberStrike using `?link` in the ingame Lobby chat in order to execute commands.',
          );
          return;
        }

        const publicProfile = await PublicProfile.findOne({ where: { Cmid: discordUser.Cmid } });

        if (!publicProfile || publicProfile.AccessLevel === MemberAccessLevel.Default) {
          // await message.reply('You're not allowed to run commands.');
          return;
        }

        const cmd = message.cleanContent.substring(1);
        const cmdArgs =
          cmd.match(/[a-zA-Z0-9-]+|"(?:\\"|[^"])+"/g)?.map((_) => (_.match(/".+"/g) ? _.slice(1, -1) : _)) ?? [];

        switch (cmdArgs[0]?.toLocaleLowerCase()) {
          case 'clear': {
            let messages = await message.channel.bulkDelete(100);

            while (messages.size > 0) {
              messages = await message.channel.bulkDelete(100);
            }
            break;
          }
          case 'help':
            this.PrintDiscordHelp(message);
            break;
          case 'quit':
            break;
          default:
            await CommandHandler.HandleCommand(
              cmdArgs[0].toLocaleLowerCase(),
              cmdArgs.slice(1),
              undefined,
              undefined,
              async (invoker: any, success: boolean, error?: string | undefined | null) => {
                if (success && !error?.trim().length) {
                  await message.reply(`\`\`\`${invoker.Output}\`\`\``);
                } else {
                  await message.reply(`\`\`\`${error}\`\`\``);
                }
              },
            );
            break;
        }
      } else if (message.channel.id === this.discordSettings.ChatChannelId) {
        const discordUser = await this.GetDiscordUserFromDiscordId(message.author.id);

        if (!discordUser) {
          await message.reply(
            'Your message could not be delivered to the Lobby chat.\nPlease link your Discord profile to UberStrike using `?link` in the ingame Lobby chat.',
          );
          return;
        }

        const publicProfile = await PublicProfile.findOne({ where: { Cmid: discordUser.Cmid } });

        await ParadiseService.Instance.SocketHost.SendToCommServer(
          PacketType.ChatMessage,
          new WebSocketChatMessage({
            Cmid: discordUser.Cmid,
            Name: `[Discord] ${publicProfile?.Name || message.author.displayName}`,
            Message: message.cleanContent,
          }),
        );
      } else if (this.roomChatMap[message.channel.id]) {
        const discordUser = await this.GetDiscordUserFromDiscordId(message.author.id);

        if (!discordUser) {
          await message.reply(
            'Your message could not be delivered to the game chat.\nPlease link your Discord profile to UberStrike using `?link` in the ingame Lobby chat.',
          );
          return;
        }

        const publicProfile = await PublicProfile.findOne({ where: { Cmid: discordUser.Cmid } });

        const room = await GameRoom.findOne({ where: { Number: this.roomChatMap[message.channel.id] } });
        if (!room) {
          await message.reply(
            'Your message could not be delivered to the game chat.\nThis room does not exist anymore.',
          );
          return;
        }

        const server = await PhotonServer.findOne({
          where: { IP: room.ServerIp, Port: room.ServerPort, UsageType: PhotonUsageType.All },
        });
        if (!server) return;

        await ParadiseService.Instance.SocketHost.SendToGameServer(
          server.Guid,
          PacketType.ChatMessage,
          new WebSocketChatMessage({
            Cmid: discordUser.Cmid,
            Name: `[Discord] ${publicProfile?.Name || message.author.displayName}`,
            Message: message.cleanContent,
            RoomNumber: room.Number,
          }),
        );
      }
    }
  }
  // #endregion

  private async PrintDiscordHelp(message: Message): Promise<void> {
    const lines = ['Available commands:\n'];

    for (const commandObj of CommandHandler.Commands.toSorted((a, b) =>
      a.Command.localeCompare(b.Command, undefined, { sensitivity: 'base' }),
    )) {
      if (commandObj.Command.toLocaleLowerCase() === 'clear') {
        lines.push('clear\t\tClears the messages in the Command channel.');
      } else if (commandObj.Command.toLocaleLowerCase() === 'help') {
        lines.push('help\t\tShows this help text. (Alias: h)');
      } else {
        /* eslint-disable new-cap */
        const cmd = new commandObj('');
        lines.push(cmd.HelpString);
      }
    }

    await message.reply(`\`\`\`${lines.join('\r\n')}\`\`\``);
  }

  private GetNameForMapID(mapID: number): string {
    switch (mapID) {
      case 3:
        return 'Apex Twin';
      case 4:
        return 'Aqualab Research Hub';
      case 5:
        return 'Catalyst';
      case 6:
        return 'CuberSpace';
      case 7:
        return 'CuberStrike';
      case 8:
        return 'Fort Winter';
      case 9:
        return 'Ghost Island';
      case 10:
        return "Gideon's Tower";
      case 11:
        return 'Monkey Island 2';
      case 12:
        return 'Lost Paradise 2';
      case 13:
        return 'Sky Garden';
      case 14:
        return 'SuperPRISM Reactor';
      case 15:
        return 'Temple of the Raven';
      case 16:
        return 'The Hangar';
      case 17:
        return 'The Warehouse';
      case 18:
        return 'Danger Zone';
      case 64:
        return 'Space City';
      case 65:
        return 'Spaceport Alpha';
      case 66:
        return 'UberZone';
      default:
        return 'Unknown Map';
    }
  }

  private GetImageNameForMapID(mapID: number): string {
    switch (mapID) {
      case 3:
        return 'ApexTwin';
      case 4:
        return 'AqualabResearchHub';
      case 5:
        return 'Catalyst';
      case 6:
        return 'Cuberspace';
      case 7:
        return 'CuberStrike';
      case 8:
        return 'FortWinter';
      case 9:
        return 'GhostIsland';
      case 10:
        return 'GideonsTower';
      case 11:
        return 'MonkeyIsland';
      case 12:
        return 'LostParadise2';
      case 13:
        return 'SkyGarden';
      case 14:
        return 'SuperPRISMReactor';
      case 15:
        return 'TempleOfTheRaven';
      case 16:
        return 'TheHangar';
      case 17:
        return 'TheWarehouse';
      case 18:
        return 'Volley';
      case 64:
        return 'SpaceCity';
      case 65:
        return 'SpacePortAlpha';
      case 66:
        return 'UberZone';
      default:
        return 'Default';
    }
  }

  private GetGamemodeName(gameMode: GameModeType): string {
    switch (gameMode) {
      case GameModeType.DeathMatch:
        return 'Deathmatch';
      case GameModeType.TeamDeathMatch:
        return 'Team Deathmatch';
      case GameModeType.EliminationMode:
        return 'Team Elimination';
      default:
        return 'Unknown Game Mode';
    }
  }

  private GetGameFlags(gameFlags: number): string {
    return (Object.values(GAME_FLAGS).filter(Number) as number[])
      .map((flag) => {
        switch (flag) {
          case GAME_FLAGS.None:
            return 'None';
          case GAME_FLAGS.LowGravity:
            return 'Low Gravity';
          case GAME_FLAGS.NoArmor:
            return 'No Armor';
          case GAME_FLAGS.QuickSwitch:
            return 'Quick Switch';
          case GAME_FLAGS.MeleeOnly:
            return 'Meelee Only';
          default:
            return null;
        }
      })
      .filter(Boolean)
      .join(', ');
  }
}
