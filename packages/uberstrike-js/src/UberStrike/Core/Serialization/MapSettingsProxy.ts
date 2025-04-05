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

import { MapSettings } from '@/UberStrike/Core/Models/Views';
import Int32Proxy from './Int32Proxy';

export default class MapSettingsProxy {
  static Serialize(stream: number[], instance: MapSettings): void {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.KillsCurrent);
    Int32Proxy.Serialize(memoryStream, instance.KillsMax);
    Int32Proxy.Serialize(memoryStream, instance.KillsMin);
    Int32Proxy.Serialize(memoryStream, instance.PlayersCurrent);
    Int32Proxy.Serialize(memoryStream, instance.PlayersMax);
    Int32Proxy.Serialize(memoryStream, instance.PlayersMin);
    Int32Proxy.Serialize(memoryStream, instance.TimeCurrent);
    Int32Proxy.Serialize(memoryStream, instance.TimeMax);
    Int32Proxy.Serialize(memoryStream, instance.TimeMin);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MapSettings {
    return new MapSettings({
      KillsCurrent: Int32Proxy.Deserialize(bytes),
      KillsMax: Int32Proxy.Deserialize(bytes),
      KillsMin: Int32Proxy.Deserialize(bytes),
      PlayersCurrent: Int32Proxy.Deserialize(bytes),
      PlayersMax: Int32Proxy.Deserialize(bytes),
      PlayersMin: Int32Proxy.Deserialize(bytes),
      TimeCurrent: Int32Proxy.Deserialize(bytes),
      TimeMax: Int32Proxy.Deserialize(bytes),
      TimeMin: Int32Proxy.Deserialize(bytes),
    });
  }
}
