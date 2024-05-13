import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import CommActorInfo from './CommActorInfo';
import GameRoom from './GameRoom';

/* eslint no-shadow: "off" */
export enum Keys {
  AccessLevel,
  Channel,
  ClanTag,
  Cmid,
  CurrentRoom,
  ModerationFlag,
  ModInformation,
  PlayerName,
}

export default class CommActorInfoDelta {
  [key: string]: any;

  public readonly Changes: { [key: int]: any };
  public DeltaMask: int;
  public Id: byte;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public Apply(instance: CommActorInfo) {
    Object.entries(this.Changes).forEach(([key, value]) => {
      switch (key) {
        case `${Keys.AccessLevel}`:
          instance.AccessLevel = value as MemberAccessLevel;

          break;
        case `${Keys.Channel}`:
          instance.Channel = value as ChannelType;

          break;
        case `${Keys.ClanTag}`:
          instance.ClanTag = value as string;

          break;
        case `${Keys.Cmid}`:
          instance.Cmid = value as int;

          break;
        case `${Keys.CurrentRoom}`:
          instance.CurrentRoom = value as GameRoom;

          break;
        case `${Keys.ModerationFlag}`:
          instance.ModerationFlag = value as byte;

          break;
        case `${Keys.ModInformation}`:
          instance.ModInformation = value as string;

          break;
        case `${Keys.PlayerName}`:
          instance.PlayerName = value as string;

          break;
        default:
          break;
      }
    });
  }
}
