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

import { ParadiseMapView } from '@/UberStrike/Core/Models/Views';
import MapViewProxy from './MapViewProxy';
import StringProxy from './StringProxy';

export default class ParadiseMapViewProxy {
  static Serialize(stream: number[], instance: ParadiseMapView): void {
    const memoryStream: number[] = [];
    MapViewProxy.Serialize(memoryStream, instance);
    StringProxy.Serialize(memoryStream, instance.FileName);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): ParadiseMapView {
    const mapView = MapViewProxy.Deserialize(bytes) as ParadiseMapView;
    mapView.FileName = StringProxy.Deserialize(bytes);

    return mapView;
  }
}
