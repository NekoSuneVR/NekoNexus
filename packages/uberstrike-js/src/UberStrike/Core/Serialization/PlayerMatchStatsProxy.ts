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

import { PlayerMatchStats } from '@/UberStrike/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import Int32Proxy from './Int32Proxy';
import Int64Proxy from './Int64Proxy';
import PlayerPersonalRecordStatisticsViewProxy from './PlayerPersonalRecordStatisticsViewProxy';
import PlayerWeaponStatisticsViewProxy from './PlayerWeaponStatisticsViewProxy';

export default class PlayerMatchStatsProxy {
  static Serialize(stream: number[], instance: PlayerMatchStats): void {
    let num = 0;

    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Death);
    BooleanProxy.Serialize(memoryStream, instance.HasFinishedMatch);
    BooleanProxy.Serialize(memoryStream, instance.HasWonMatch);
    Int32Proxy.Serialize(memoryStream, instance.Headshots);
    Int64Proxy.Serialize(memoryStream, instance.Hits);
    Int32Proxy.Serialize(memoryStream, instance.Kills);
    Int32Proxy.Serialize(memoryStream, instance.Nutshots);

    if (instance.PersonalRecord) {
      PlayerPersonalRecordStatisticsViewProxy.Serialize(memoryStream, instance.PersonalRecord);
    } else {
      num |= 1;
    }

    Int64Proxy.Serialize(memoryStream, instance.Shots);
    Int32Proxy.Serialize(memoryStream, instance.Smackdowns);
    Int32Proxy.Serialize(memoryStream, instance.TimeSpentInGame);

    if (instance.WeaponStatistics) {
      PlayerWeaponStatisticsViewProxy.Serialize(memoryStream, instance.WeaponStatistics);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PlayerMatchStats {
    const num = Int32Proxy.Deserialize(bytes);
    const playerMatchStats = new PlayerMatchStats();
    playerMatchStats.Cmid = Int32Proxy.Deserialize(bytes);
    playerMatchStats.Death = Int32Proxy.Deserialize(bytes);
    playerMatchStats.HasFinishedMatch = BooleanProxy.Deserialize(bytes);
    playerMatchStats.HasWonMatch = BooleanProxy.Deserialize(bytes);
    playerMatchStats.Headshots = Int32Proxy.Deserialize(bytes);
    playerMatchStats.Hits = Int64Proxy.Deserialize(bytes);
    playerMatchStats.Kills = Int32Proxy.Deserialize(bytes);
    playerMatchStats.Nutshots = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      playerMatchStats.PersonalRecord = PlayerPersonalRecordStatisticsViewProxy.Deserialize(bytes);
    }

    playerMatchStats.Shots = Int64Proxy.Deserialize(bytes);
    playerMatchStats.Smackdowns = Int32Proxy.Deserialize(bytes);
    playerMatchStats.TimeSpentInGame = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      playerMatchStats.WeaponStatistics = PlayerWeaponStatisticsViewProxy.Deserialize(bytes);
    }

    return playerMatchStats;
  }
}
