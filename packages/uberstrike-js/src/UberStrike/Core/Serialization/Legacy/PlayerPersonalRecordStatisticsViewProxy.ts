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

import { PlayerPersonalRecordStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class PlayerPersonalRecordStatisticsViewProxy {
  static Serialize(stream: number[], instance: PlayerPersonalRecordStatisticsView): void {
    const num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.MostArmorPickedUp);
      Int32Proxy.Serialize(memoryStream, instance.MostCannonSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostConsecutiveSnipes);
      Int32Proxy.Serialize(memoryStream, instance.MostDamageDealt);
      Int32Proxy.Serialize(memoryStream, instance.MostDamageReceived);
      Int32Proxy.Serialize(memoryStream, instance.MostHandgunSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostHeadshots);
      Int32Proxy.Serialize(memoryStream, instance.MostHealthPickedUp);
      Int32Proxy.Serialize(memoryStream, instance.MostLauncherSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostMachinegunSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostMeleeSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostNutshots);
      Int32Proxy.Serialize(memoryStream, instance.MostShotgunSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostSniperSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostSplattergunSplats);
      Int32Proxy.Serialize(memoryStream, instance.MostXPEarned);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): PlayerPersonalRecordStatisticsView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let playerPersonalRecordStatisticsView: PlayerPersonalRecordStatisticsView | null = null;
    if (num !== 0) {
      playerPersonalRecordStatisticsView = new PlayerPersonalRecordStatisticsView();
      playerPersonalRecordStatisticsView.MostArmorPickedUp = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostCannonSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostConsecutiveSnipes = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostDamageDealt = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostDamageReceived = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostHandgunSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostHeadshots = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostHealthPickedUp = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostLauncherSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostMachinegunSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostMeleeSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostNutshots = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostShotgunSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostSniperSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostSplattergunSplats = Int32Proxy.Deserialize(bytes);
      playerPersonalRecordStatisticsView.MostXPEarned = Int32Proxy.Deserialize(bytes);
    }
    return playerPersonalRecordStatisticsView;
  }
}
