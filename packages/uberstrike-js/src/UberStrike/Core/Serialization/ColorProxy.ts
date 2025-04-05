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

import type Color from '@/UnityEngine/Color';
import SingleProxy from './SingleProxy';

export default class ColorProxy {
  static Serialize(bytes: number[], instance: Color): void {
    SingleProxy.Serialize(bytes, instance.r);
    SingleProxy.Serialize(bytes, instance.g);
    SingleProxy.Serialize(bytes, instance.b);
  }

  static Deserialize(bytes: number[]): Color {
    return { r: SingleProxy.Deserialize(bytes), g: SingleProxy.Deserialize(bytes), b: SingleProxy.Deserialize(bytes) };
  }
}
