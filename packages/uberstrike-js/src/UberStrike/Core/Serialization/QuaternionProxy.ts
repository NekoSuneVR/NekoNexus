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

import Quaternion from '@/UnityEngine/Quaternion';
import SingleProxy from './SingleProxy';

export default class QuaternionProxy {
  static Serialize(bytes: number[], instance: Quaternion) {
    SingleProxy.Serialize(bytes, instance.x);
    SingleProxy.Serialize(bytes, instance.y);
    SingleProxy.Serialize(bytes, instance.z);
    SingleProxy.Serialize(bytes, instance.w);
  }

  static Deserialize(bytes: number[]): Quaternion {
    return new Quaternion(
      SingleProxy.Deserialize(bytes),
      SingleProxy.Deserialize(bytes),
      SingleProxy.Deserialize(bytes),
      SingleProxy.Deserialize(bytes),
    );
  }
}
