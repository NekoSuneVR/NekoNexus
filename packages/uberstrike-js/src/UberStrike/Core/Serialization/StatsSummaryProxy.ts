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

import { StatsSummary, TeamID } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import DictionaryProxy from './DictionaryProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';
import UInt16Proxy from './UInt16Proxy';

export default class StatsSummaryProxy {
  static Serialize(stream: number[], instance: StatsSummary): void {
    let num = 0;
    const memoryStream: number[] = [];

    if (instance.Achievements) {
      DictionaryProxy.Serialize<number, number>(
        memoryStream,
        instance.Achievements,
        ByteProxy.Serialize,
        UInt16Proxy.Serialize,
      );
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Deaths);
    Int32Proxy.Serialize(memoryStream, instance.Kills);
    Int32Proxy.Serialize(memoryStream, instance.Level);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 2;
    }

    EnumProxy.Serialize<TeamID>(memoryStream, instance.Team);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): StatsSummary {
    const num = Int32Proxy.Deserialize(bytes);
    const statsSummary = new StatsSummary();

    if ((num & 1) !== 0) {
      statsSummary.Achievements = DictionaryProxy.Deserialize<number, number>(
        bytes,
        ByteProxy.Deserialize,
        UInt16Proxy.Deserialize,
      );
    }

    statsSummary.Cmid = Int32Proxy.Deserialize(bytes);
    statsSummary.Deaths = Int32Proxy.Deserialize(bytes);
    statsSummary.Kills = Int32Proxy.Deserialize(bytes);
    statsSummary.Level = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      statsSummary.Name = StringProxy.Deserialize(bytes);
    }

    statsSummary.Team = EnumProxy.Deserialize<TeamID>(bytes);

    return statsSummary;
  }
}
