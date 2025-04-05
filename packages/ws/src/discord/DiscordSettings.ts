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

class DiscordIntegrationSettings {
  LobbyChat: boolean;
  RoomChats: boolean;
  Commands: boolean;
  PlayerJoinAnnouncements: boolean;
  PlayerLeaveAnnouncements: boolean;
  RoomOpenAnnouncements: boolean;
  RoomCloseAnnouncements: boolean;
  RoundStartAnnouncements: boolean;
  RoundEndAnnouncements: boolean;
  ErrorLog: boolean;
}

class DiscordWebHookSettings {
  LobbyChat: string;
  PlayerAnnouncements: string;
  RoomAnnouncements: string;
  RoundAnnouncements: string;
  ErrorLog: string;
}

export default class DiscordSettings {
  Enabled: boolean;
  BotToken: string;
  Integrations: DiscordIntegrationSettings = new DiscordIntegrationSettings();
  GuildId: string;
  ChatChannelId: string;
  CommandChannelId: string;
  RoomChatCategory: string;
  WebHooks: DiscordWebHookSettings = new DiscordWebHookSettings();
  AnnouncementBlacklist: string[];
}
