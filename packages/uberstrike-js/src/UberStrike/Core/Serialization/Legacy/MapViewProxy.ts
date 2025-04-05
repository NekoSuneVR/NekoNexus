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

import { MapSettings, MapView } from '@/UberStrike/Core/Models/Views';
import { GameModeType } from '@/UberStrike/Core/Types';
import BooleanProxy from '../BooleanProxy';
import DictionaryProxy from '../DictionaryProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';
import MapSettingsProxy from './MapSettingsProxy';

export default class MapViewProxy {
  static Serialize(stream: number[], instance: MapView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 1;
      }
      if (instance.DisplayName) {
        StringProxy.Serialize(memoryStream, instance.DisplayName);
      } else {
        num |= 2;
      }
      if (instance.FileName) {
        StringProxy.Serialize(memoryStream, instance.FileName);
      } else {
        num |= 4;
      }
      BooleanProxy.Serialize(memoryStream, instance.IsBlueBox);
      Int32Proxy.Serialize(memoryStream, instance.MapId);
      Int32Proxy.Serialize(memoryStream, instance.MaxPlayers);
      Int32Proxy.Serialize(memoryStream, instance.RecommendedItemId);
      if (instance.SceneName) {
        StringProxy.Serialize(memoryStream, instance.SceneName);
      } else {
        num |= 8;
      }
      if (instance.Settings) {
        DictionaryProxy.Serialize<GameModeType, MapSettings | null>(
          memoryStream,
          instance.Settings,
          EnumProxy.Serialize<GameModeType>,
          MapSettingsProxy.Serialize,
        );
      } else {
        num |= 16;
      }
      Int32Proxy.Serialize(memoryStream, instance.SupportedGameModes);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): MapView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let mapView: MapView | null = null;
    if (num !== 0) {
      mapView = new MapView();
      if ((num & 1) !== 0) {
        mapView.Description = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        mapView.DisplayName = StringProxy.Deserialize(bytes);
      }
      if ((num & 4) !== 0) {
        mapView.FileName = StringProxy.Deserialize(bytes);
      }
      mapView.IsBlueBox = BooleanProxy.Deserialize(bytes);
      mapView.MapId = Int32Proxy.Deserialize(bytes);
      mapView.MaxPlayers = Int32Proxy.Deserialize(bytes);
      mapView.RecommendedItemId = Int32Proxy.Deserialize(bytes);
      if ((num & 8) !== 0) {
        mapView.SceneName = StringProxy.Deserialize(bytes);
      }
      if ((num & 16) !== 0) {
        mapView.Settings = DictionaryProxy.Deserialize<GameModeType, MapSettings | null>(
          bytes,
          EnumProxy.Deserialize<GameModeType>,
          MapSettingsProxy.Deserialize,
        );
      }
      mapView.SupportedGameModes = Int32Proxy.Deserialize(bytes);
    }
    return mapView;
  }
}
