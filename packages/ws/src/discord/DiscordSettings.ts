export class DiscordIntegrationSettings {
  public LobbyChat: boolean;
  public RoomChats: boolean;
  public Commands: boolean;
  public PlayerJoinAnnouncements: boolean;
  public PlayerLeaveAnnouncements: boolean;
  public RoomOpenAnnouncements: boolean;
  public RoomCloseAnnouncements: boolean;
  public RoundStartAnnouncements: boolean;
  public RoundEndAnnouncements: boolean;
  public ErrorLog: boolean;
}

export class DiscordWebHookSettings {
  public LobbyChat: string;
  public PlayerAnnouncements: string;
  public RoomAnnouncements: string;
  public RoundAnnouncements: string;
  public ErrorLog: string;
}

export class DiscordSettings {
  public Enabled: boolean;
  public BotToken: string;
  public Integrations: DiscordIntegrationSettings = new DiscordIntegrationSettings();
  public GuildId: string;
  public ChatChannelId: string;
  public CommandChannelId: string;
  public RoomChatCategory: string;
  WebHooks: DiscordWebHookSettings = new DiscordWebHookSettings();
  AnnouncementBlacklist: string[];
}
