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

import { PlayerStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from './Int32Proxy';
import Int64Proxy from './Int64Proxy';
import PlayerPersonalRecordStatisticsViewProxy from './PlayerPersonalRecordStatisticsViewProxy';
import PlayerWeaponStatisticsViewProxy from './PlayerWeaponStatisticsViewProxy';

export default class PlayerStatisticsViewProxy {
  static Serialize(stream: number[], instance: PlayerStatisticsView): void {
    let num = 0;

    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Headshots);
    Int64Proxy.Serialize(memoryStream, instance.Hits);
    Int32Proxy.Serialize(memoryStream, instance.Level);
    Int32Proxy.Serialize(memoryStream, instance.Nutshots);

    if (instance.PersonalRecord) {
      PlayerPersonalRecordStatisticsViewProxy.Serialize(memoryStream, instance.PersonalRecord);
    } else {
      num |= 1;
    }

    Int64Proxy.Serialize(memoryStream, instance.Shots);
    Int32Proxy.Serialize(memoryStream, instance.Splats);
    Int32Proxy.Serialize(memoryStream, instance.Splatted);
    Int32Proxy.Serialize(memoryStream, instance.TimeSpentInGame);

    if (instance.WeaponStatistics) {
      PlayerWeaponStatisticsViewProxy.Serialize(memoryStream, instance.WeaponStatistics);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.Xp);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PlayerStatisticsView {
    const num = Int32Proxy.Deserialize(bytes);
    const playerStatisticsView = new PlayerStatisticsView();
    playerStatisticsView.Cmid = Int32Proxy.Deserialize(bytes);
    playerStatisticsView.Headshots = Int32Proxy.Deserialize(bytes);
    playerStatisticsView.Hits = Int64Proxy.Deserialize(bytes);
    playerStatisticsView.Level = Int32Proxy.Deserialize(bytes);
    playerStatisticsView.Nutshots = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      playerStatisticsView.PersonalRecord = PlayerPersonalRecordStatisticsViewProxy.Deserialize(bytes);
    }

    playerStatisticsView.Shots = Int64Proxy.Deserialize(bytes);
    playerStatisticsView.Splats = Int32Proxy.Deserialize(bytes);
    playerStatisticsView.Splatted = Int32Proxy.Deserialize(bytes);
    playerStatisticsView.TimeSpentInGame = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      playerStatisticsView.WeaponStatistics = PlayerWeaponStatisticsViewProxy.Deserialize(bytes);
    }

    playerStatisticsView.Xp = Int32Proxy.Deserialize(bytes);

    return playerStatisticsView;
  }
}
