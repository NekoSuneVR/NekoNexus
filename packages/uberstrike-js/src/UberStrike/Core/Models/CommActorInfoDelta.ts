/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import CommActorInfo from './CommActorInfo';
import GameRoom from './GameRoom';

/* eslint no-shadow: "off" */
enum Keys {
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
  static Keys = Keys;

  Changes: Record<Keys, any>;
  DeltaMask: number;
  Id: number;

  constructor(params: Partial<CommActorInfoDelta> = {}) {
    Object.assign(this, params);
  }

  Apply(instance: CommActorInfo) {
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
          instance.Cmid = value as number;

          break;
        case `${Keys.CurrentRoom}`:
          instance.CurrentRoom = value as GameRoom;

          break;
        case `${Keys.ModerationFlag}`:
          instance.ModerationFlag = value as number;

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
