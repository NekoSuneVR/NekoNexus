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
import { MatchView, PlayerStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import PlayerStatisticsViewProxy from './PlayerStatisticsViewProxy';

export default class MatchViewProxy {
  static Serialize(stream: number[], instance: MatchView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      EnumProxy.Serialize<GameModeType>(memoryStream, instance.GameModeId);
      Int32Proxy.Serialize(memoryStream, instance.MapId);
      if (instance.PlayersCompleted) {
        ListProxy.Serialize<PlayerStatisticsView>(
          memoryStream,
          instance.PlayersCompleted,
          PlayerStatisticsViewProxy.Serialize,
        );
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.PlayersLimit);
      if (instance.PlayersNonCompleted) {
        ListProxy.Serialize<PlayerStatisticsView>(
          memoryStream,
          instance.PlayersNonCompleted,
          PlayerStatisticsViewProxy.Serialize,
        );
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.TimeLimit);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): MatchView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let matchView: MatchView | null = null;
    if (num !== 0) {
      matchView = new MatchView();
      matchView.GameModeId = EnumProxy.Deserialize<GameModeType>(bytes);
      matchView.MapId = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        matchView.PlayersCompleted = ListProxy.Deserialize<PlayerStatisticsView>(
          bytes,
          PlayerStatisticsViewProxy.Deserialize,
        );
      }
      matchView.PlayersLimit = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        matchView.PlayersNonCompleted = ListProxy.Deserialize<PlayerStatisticsView>(
          bytes,
          PlayerStatisticsViewProxy.Deserialize,
        );
      }
      matchView.TimeLimit = Int32Proxy.Deserialize(bytes);
    }
    return matchView;
  }
}
