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

import { MatchPointsView } from '@/UberStrike/Core/Models/Views';
import Int32Proxy from './Int32Proxy';

export default class MatchPointsViewProxy {
  static Serialize(stream: number[], instance: MatchPointsView) {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.LoserPointsBase);
    Int32Proxy.Serialize(memoryStream, instance.LoserPointsPerMinute);
    Int32Proxy.Serialize(memoryStream, instance.MaxTimeInGame);
    Int32Proxy.Serialize(memoryStream, instance.WinnerPointsBase);
    Int32Proxy.Serialize(memoryStream, instance.WinnerPointsPerMinute);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MatchPointsView {
    return new MatchPointsView({
      LoserPointsBase: Int32Proxy.Deserialize(bytes),
      LoserPointsPerMinute: Int32Proxy.Deserialize(bytes),
      MaxTimeInGame: Int32Proxy.Deserialize(bytes),
      WinnerPointsBase: Int32Proxy.Deserialize(bytes),
      WinnerPointsPerMinute: Int32Proxy.Deserialize(bytes),
    });
  }
}
