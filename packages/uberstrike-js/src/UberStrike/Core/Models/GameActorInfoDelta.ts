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

import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import FireMode from './FireMode';
import GameActorInfo from './GameActorInfo';
import PlayerStates from './PlayerStates';
import SurfaceType from './SurfaceType';
import TeamID from './TeamID';

/* eslint no-shadow: "off" */
enum Keys {
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
  static Keys = Keys;

  Changes: Record<Keys, any>;
  DeltaMask: number;
  Id: number;

  constructor(params: Partial<GameActorInfoDelta> = {}) {
    Object.assign(this, params);
  }

  Apply(instance: GameActorInfo) {
    Object.entries(this.Changes).forEach(([key, value]) => {
      switch (key) {
        case `${Keys.AccessLevel}`:
          instance.AccessLevel = value as MemberAccessLevel;

          break;
        case `${Keys.ArmorPointCapacity}`:
          instance.ArmorPointCapacity = value as number;

          break;
        case `${Keys.ArmorPoints}`:
          instance.ArmorPoints = value as number;

          break;
        case `${Keys.Channel}`:
          instance.Channel = value as ChannelType;

          break;
        case `${Keys.ClanTag}`:
          instance.ClanTag = value as string;

          break;
        case `${Keys.Cmid}`:
          instance.Cmid = value as number;

          break;
        case `${Keys.CurrentFiringMode}`:
          instance.CurrentFiringMode = value as FireMode;

          break;
        case `${Keys.CurrentWeaponSlot}`:
          instance.CurrentWeaponSlot = value as number;

          break;
        case `${Keys.Deaths}`:
          instance.Deaths = value as number;

          break;
        case `${Keys.FunctionalItems}`:
          instance.FunctionalItems = value as number[];

          break;
        case `${Keys.Gear}`:
          instance.Gear = value as number[];

          break;
        case `${Keys.Health}`:
          instance.Health = value as number;

          break;
        case `${Keys.Kills}`:
          instance.Kills = value as number;

          break;
        case `${Keys.Level}`:
          instance.Level = value as number;

          break;
        case `${Keys.Ping}`:
          instance.Ping = value as number;

          break;
        case `${Keys.PlayerId}`:
          instance.PlayerId = value as number;

          break;
        case `${Keys.PlayerName}`:
          instance.PlayerName = value as string;

          break;
        case `${Keys.PlayerState}`:
          instance.PlayerState = value as PlayerStates;

          break;
        case `${Keys.QuickItems}`:
          instance.QuickItems = value as number[];

          break;
        case `${Keys.Rank}`:
          instance.Rank = value as number;

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
          instance.Weapons = value as number[];

          break;
        default:
          break;
      }
    });
  }

  UpdateDeltaMask(): void {
    let mask = 0;

    for (const key of Object.keys(this.Changes)) {
      mask |= 1 << Number(key);
    }

    this.DeltaMask = mask;
  }

  Reset(): void {
    this.Changes = {} as Record<Keys, any>;
    this.UpdateDeltaMask();
  }
}
