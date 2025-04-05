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

import { DailyPointsView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class DailyPointsViewProxy {
  static Serialize(stream: number[], instance: DailyPointsView): void {
    const num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.Current);
      Int32Proxy.Serialize(memoryStream, instance.PointsMax);
      Int32Proxy.Serialize(memoryStream, instance.PointsTomorrow);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): DailyPointsView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let dailyPointsView: DailyPointsView | null = null;
    if (num !== 0) {
      dailyPointsView = new DailyPointsView();
      dailyPointsView.Current = Int32Proxy.Deserialize(bytes);
      dailyPointsView.PointsMax = Int32Proxy.Deserialize(bytes);
      dailyPointsView.PointsTomorrow = Int32Proxy.Deserialize(bytes);
    }
    return dailyPointsView;
  }
}
