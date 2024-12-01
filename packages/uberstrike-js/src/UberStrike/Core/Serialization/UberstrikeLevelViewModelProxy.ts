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

import { MapView } from '@/UberStrike/Core/Models/Views';
import { UberstrikeLevelViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import MapViewProxy from './MapViewProxy';

export default class UberstrikeLevelViewModelProxy {
  static Serialize(stream: number[], instance: UberstrikeLevelViewModel): void {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.Maps) {
      ListProxy.Serialize<MapView>(memoryStream, instance.Maps, MapViewProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): UberstrikeLevelViewModel {
    const num = Int32Proxy.Deserialize(bytes);
    const uberstrikeLevelViewModel = new UberstrikeLevelViewModel();

    if ((num & 1) !== 0) {
      uberstrikeLevelViewModel.Maps = ListProxy.Deserialize<MapView>(bytes, MapViewProxy.Deserialize);
    }

    return uberstrikeLevelViewModel;
  }
}
