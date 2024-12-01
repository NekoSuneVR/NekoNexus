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

import { PlayerLevelCapView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class PlayerLevelCapViewProxy {
  static Serialize(stream: number[], instance: PlayerLevelCapView): void {
    const num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.Level);
      Int32Proxy.Serialize(memoryStream, instance.PlayerLevelCapId);
      Int32Proxy.Serialize(memoryStream, instance.XPRequired);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): PlayerLevelCapView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let playerLevelCapView: PlayerLevelCapView | null = null;
    if (num !== 0) {
      playerLevelCapView = new PlayerLevelCapView();
      playerLevelCapView.Level = Int32Proxy.Deserialize(bytes);
      playerLevelCapView.PlayerLevelCapId = Int32Proxy.Deserialize(bytes);
      playerLevelCapView.XPRequired = Int32Proxy.Deserialize(bytes);
    }
    return playerLevelCapView;
  }
}
