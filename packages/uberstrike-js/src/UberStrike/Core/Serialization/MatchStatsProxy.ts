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

import { GameModeType } from '@/UberStrike/Core/Types';
import { MatchStats, PlayerMatchStats } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import PlayerMatchStatsProxy from './PlayerMatchStatsProxy';

export default class MatchStatsProxy {
  static Serialize(stream: number[], instance: MatchStats): void {
    let num = 0;

    const memoryStream: number[] = [];
    EnumProxy.Serialize<GameModeType>(memoryStream, instance.GameModeId);
    Int32Proxy.Serialize(memoryStream, instance.MapId);

    if (instance.Players) {
      ListProxy.Serialize<PlayerMatchStats>(memoryStream, instance.Players, PlayerMatchStatsProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.PlayersLimit);
    Int32Proxy.Serialize(memoryStream, instance.TimeLimit);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MatchStats {
    const num = Int32Proxy.Deserialize(bytes);
    const matchStats = new MatchStats();
    matchStats.GameModeId = EnumProxy.Deserialize<GameModeType>(bytes);
    matchStats.MapId = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      matchStats.Players = ListProxy.Deserialize<PlayerMatchStats>(bytes, PlayerMatchStatsProxy.Deserialize);
    }

    matchStats.PlayersLimit = Int32Proxy.Deserialize(bytes);
    matchStats.TimeLimit = Int32Proxy.Deserialize(bytes);

    return matchStats;
  }
}
