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

import Vector3 from '@/UnityEngine/Vector3';

export default class ShortVector3 {
  private value: Vector3;

  get x(): number {
    return this.value.x;
  }
  get y(): number {
    return this.value.y;
  }
  get z(): number {
    return this.value.z;
  }

  constructor(x: number, y: number, z: number) {
    this.value = new Vector3(x, y, z);
  }

  static multiply(vector: ShortVector3, value: number): ShortVector3 {
    vector.value.x *= value;
    vector.value.y *= value;
    vector.value.z *= value;

    return vector;
  }

  static add(vector: ShortVector3, value: ShortVector3): ShortVector3 {
    vector.value.x += value.value.x;
    vector.value.y += value.value.y;
    vector.value.z += value.value.z;

    return vector;
  }

  static subtract(vector: ShortVector3, value: ShortVector3): ShortVector3 {
    vector.value.x -= value.value.x;
    vector.value.y -= value.value.y;
    vector.value.z -= value.value.z;

    return vector;
  }
}
