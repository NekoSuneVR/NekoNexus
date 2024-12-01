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

import { EndOfMatchData, StatsSummary } from '@/UberStrike/Core/Models';
import BooleanProxy from './BooleanProxy';
import ByteProxy from './ByteProxy';
import DictionaryProxy from './DictionaryProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StatsCollectionProxy from './StatsCollectionProxy';
import StatsSummaryProxy from './StatsSummaryProxy';
import StringProxy from './StringProxy';
import UInt16Proxy from './UInt16Proxy';

export default class EndOfMatchDataProxy {
  static Serialize(stream: number[], instance: EndOfMatchData): void {
    let num = 0;
    const memoryStream: number[] = [];

    BooleanProxy.Serialize(memoryStream, instance.HasWonMatch);

    if (instance.MatchGuid) {
      StringProxy.Serialize(memoryStream, instance.MatchGuid);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.MostEffecientWeaponId);

    if (instance.MostValuablePlayers) {
      ListProxy.Serialize<StatsSummary>(memoryStream, instance.MostValuablePlayers, StatsSummaryProxy.Serialize);
    } else {
      num |= 2;
    }

    if (instance.PlayerStatsBestPerLife) {
      StatsCollectionProxy.Serialize(memoryStream, instance.PlayerStatsBestPerLife);
    } else {
      num |= 4;
    }

    if (instance.PlayerStatsTotal) {
      StatsCollectionProxy.Serialize(memoryStream, instance.PlayerStatsTotal);
    } else {
      num |= 8;
    }

    if (instance.PlayerXpEarned) {
      DictionaryProxy.Serialize<number, number>(
        memoryStream,
        instance.PlayerXpEarned,
        ByteProxy.Serialize,
        UInt16Proxy.Serialize,
      );
    } else {
      num |= 16;
    }

    Int32Proxy.Serialize(memoryStream, instance.TimeInGameMinutes);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): EndOfMatchData {
    const num = Int32Proxy.Deserialize(bytes);
    const endOfMatchData = new EndOfMatchData();
    endOfMatchData.HasWonMatch = BooleanProxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      endOfMatchData.MatchGuid = StringProxy.Deserialize(bytes);
    }

    endOfMatchData.MostEffecientWeaponId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      endOfMatchData.MostValuablePlayers = ListProxy.Deserialize<StatsSummary>(bytes, StatsSummaryProxy.Deserialize);
    }

    if ((num & 4) !== 0) {
      endOfMatchData.PlayerStatsBestPerLife = StatsCollectionProxy.Deserialize(bytes);
    }

    if ((num & 8) !== 0) {
      endOfMatchData.PlayerStatsTotal = StatsCollectionProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      endOfMatchData.PlayerXpEarned = DictionaryProxy.Deserialize<number, number>(
        bytes,
        ByteProxy.Deserialize,
        UInt16Proxy.Deserialize,
      );
    }

    endOfMatchData.TimeInGameMinutes = Int32Proxy.Deserialize(bytes);

    return endOfMatchData;
  }
}
