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
import Int32Proxy from './Int32Proxy';

export default class PlayerPersonalRecordStatisticsViewProxy {
  static Serialize(stream: number[], instance: PlayerPersonalRecordStatisticsView): void {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.MostArmorPickedUp);
    Int32Proxy.Serialize(memoryStream, instance.MostCannonSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostConsecutiveSnipes);
    Int32Proxy.Serialize(memoryStream, instance.MostDamageDealt);
    Int32Proxy.Serialize(memoryStream, instance.MostDamageReceived);
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

    Int32Proxy.Serialize(memoryStream, instance.MostHandgunSplats);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PlayerPersonalRecordStatisticsView {
    return new PlayerPersonalRecordStatisticsView({
      MostArmorPickedUp: Int32Proxy.Deserialize(bytes),
      MostCannonSplats: Int32Proxy.Deserialize(bytes),
      MostConsecutiveSnipes: Int32Proxy.Deserialize(bytes),
      MostDamageDealt: Int32Proxy.Deserialize(bytes),
      MostDamageReceived: Int32Proxy.Deserialize(bytes),
      MostHeadshots: Int32Proxy.Deserialize(bytes),
      MostHealthPickedUp: Int32Proxy.Deserialize(bytes),
      MostLauncherSplats: Int32Proxy.Deserialize(bytes),
      MostMachinegunSplats: Int32Proxy.Deserialize(bytes),
      MostMeleeSplats: Int32Proxy.Deserialize(bytes),
      MostNutshots: Int32Proxy.Deserialize(bytes),
      MostShotgunSplats: Int32Proxy.Deserialize(bytes),
      MostSniperSplats: Int32Proxy.Deserialize(bytes),
      MostSplats: Int32Proxy.Deserialize(bytes),
      MostSplattergunSplats: Int32Proxy.Deserialize(bytes),
      MostXPEarned: Int32Proxy.Deserialize(bytes),

      MostHandgunSplats: Int32Proxy.Deserialize(bytes),
    });
  }
}
