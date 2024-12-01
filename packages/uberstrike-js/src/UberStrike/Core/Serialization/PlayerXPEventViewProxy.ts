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

import { PlayerXPEventView } from '@/UberStrike/DataCenter/Common/Entities';
import DecimalProxy from './DecimalProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class PlayerXPEventViewProxy {
  static Serialize(stream: number[], instance: PlayerXPEventView): void {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.PlayerXPEventId);
    DecimalProxy.Serialize(memoryStream, instance.XPMultiplier);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PlayerXPEventView {
    const num = Int32Proxy.Deserialize(bytes);
    const playerXPEventView = new PlayerXPEventView();

    if ((num & 1) !== 0) {
      playerXPEventView.Name = StringProxy.Deserialize(bytes);
    }

    playerXPEventView.PlayerXPEventId = Int32Proxy.Deserialize(bytes);
    playerXPEventView.XPMultiplier = DecimalProxy.Deserialize(bytes);

    return playerXPEventView;
  }
}
