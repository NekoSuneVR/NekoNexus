import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import FireMode from './FireMode';
import GameActorInfo from './GameActorInfo';
import PlayerStates from './PlayerStates';
import SurfaceType from './SurfaceType';
import TeamID from './TeamID';

/* eslint no-shadow: "off" */
export enum Keys {
  AccessLevel,
  ArmorPointCapacity,
  ArmorPoints,
  Channel,
  ClanTag,
  Cmid,
  CurrentFiringMode,
  CurrentWeaponSlot,
  Deaths,
  FunctionalItems,
  Gear,
  Health,
  Kills,
  Level,
  Ping,
  PlayerId,
  PlayerName,
  PlayerState,
  QuickItems,
  Rank,
  SkinColor,
  StepSound,
  TeamID,
  Weapons,
}

export default class GameActorInfoDelta {
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

  public Apply(instance: GameActorInfo) {
    Object.entries(this.Changes).forEach(([key, value]) => {
      switch (key) {
        case `${Keys.AccessLevel}`:
          instance.AccessLevel = value as MemberAccessLevel;

          break;
        case `${Keys.ArmorPointCapacity}`:
          instance.ArmorPointCapacity = value as byte;

          break;
        case `${Keys.ArmorPoints}`:
          instance.ArmorPoints = value as byte;

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
        case `${Keys.CurrentFiringMode}`:
          instance.CurrentFiringMode = value as FireMode;

          break;
        case `${Keys.CurrentWeaponSlot}`:
          instance.CurrentWeaponSlot = value as byte;

          break;
        case `${Keys.Deaths}`:
          instance.Deaths = value as short;

          break;
        case `${Keys.FunctionalItems}`:
          instance.FunctionalItems = value as List<int>;

          break;
        case `${Keys.Gear}`:
          instance.Gear = value as List<int>;

          break;
        case `${Keys.Health}`:
          instance.Health = value as short;

          break;
        case `${Keys.Kills}`:
          instance.Kills = value as short;

          break;
        case `${Keys.Level}`:
          instance.Level = value as int;

          break;
        case `${Keys.Ping}`:
          instance.Ping = value as ushort;

          break;
        case `${Keys.PlayerId}`:
          instance.PlayerId = value as byte;

          break;
        case `${Keys.PlayerName}`:
          instance.PlayerName = value as string;

          break;
        case `${Keys.PlayerState}`:
          instance.PlayerState = value as PlayerStates;

          break;
        case `${Keys.QuickItems}`:
          instance.QuickItems = value as List<int>;

          break;
        case `${Keys.Rank}`:
          instance.Rank = value as byte;

          break;
        case `${Keys.SkinColor}`:
          instance.SkinColor = value as any;

          break;
        case `${Keys.StepSound}`:
          instance.StepSound = value as SurfaceType;

          break;
        case `${Keys.TeamID}`:
          instance.TeamID = value as TeamID;

          break;
        case `${Keys.Weapons}`:
          instance.Weapons = value as List<int>;

          break;
        default:
          break;
      }
    });
  }

  public UpdateDeltaMask(): void {
    let mask = 0;

    for (const key of Object.keys(this.Changes)) {
      mask |= 1 << Number(key);
    }

    this.DeltaMask = mask;
  }

  public Reset(): void {
    for (const key in this.Changes) {
      delete this.Changes[key];
    }

    this.UpdateDeltaMask();
  }
}
