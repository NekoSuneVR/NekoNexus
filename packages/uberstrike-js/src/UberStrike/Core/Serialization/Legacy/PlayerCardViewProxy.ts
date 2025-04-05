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

import { PlayerCardView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import Int64Proxy from '../Int64Proxy';
import StringProxy from '../StringProxy';

export default class PlayerCardViewProxy {
  static Serialize(stream: number[], instance: PlayerCardView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      Int64Proxy.Serialize(memoryStream, instance.Hits);
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 1;
      }
      if (instance.Precision) {
        StringProxy.Serialize(memoryStream, instance.Precision);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.Ranking);
      Int64Proxy.Serialize(memoryStream, instance.Shots);
      Int32Proxy.Serialize(memoryStream, instance.Splats);
      Int32Proxy.Serialize(memoryStream, instance.Splatted);
      if (instance.TagName) {
        StringProxy.Serialize(memoryStream, instance.TagName);
      } else {
        num |= 4;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): PlayerCardView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let playerCardView: PlayerCardView | null = null;
    if (num !== 0) {
      playerCardView = new PlayerCardView();
      playerCardView.Cmid = Int32Proxy.Deserialize(bytes);
      playerCardView.Hits = Int64Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        playerCardView.Name = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        playerCardView.Precision = StringProxy.Deserialize(bytes);
      }
      playerCardView.Ranking = Int32Proxy.Deserialize(bytes);
      playerCardView.Shots = Int64Proxy.Deserialize(bytes);
      playerCardView.Splats = Int32Proxy.Deserialize(bytes);
      playerCardView.Splatted = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        playerCardView.TagName = StringProxy.Deserialize(bytes);
      }
    }
    return playerCardView;
  }
}
