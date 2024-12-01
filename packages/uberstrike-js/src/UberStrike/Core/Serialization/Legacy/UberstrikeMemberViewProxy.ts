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

import { UberstrikeMemberView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import PlayerCardViewProxy from './PlayerCardViewProxy';
import PlayerStatisticsViewProxy from './PlayerStatisticsViewProxy';

export default class UberstrikeMemberViewProxy {
  static Serialize(stream: number[], instance: UberstrikeMemberView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.PlayerCardView) {
        PlayerCardViewProxy.Serialize(memoryStream, instance.PlayerCardView);
      } else {
        num |= 1;
      }
      if (instance.PlayerStatisticsView) {
        PlayerStatisticsViewProxy.Serialize(memoryStream, instance.PlayerStatisticsView);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): UberstrikeMemberView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberstrikeMemberView: UberstrikeMemberView | null = null;
    if (num !== 0) {
      uberstrikeMemberView = new UberstrikeMemberView();
      if ((num & 1) !== 0) {
        uberstrikeMemberView.PlayerCardView = PlayerCardViewProxy.Deserialize(bytes)!;
      }
      if ((num & 2) !== 0) {
        uberstrikeMemberView.PlayerStatisticsView = PlayerStatisticsViewProxy.Deserialize(bytes)!;
      }
    }
    return uberstrikeMemberView;
  }
}
