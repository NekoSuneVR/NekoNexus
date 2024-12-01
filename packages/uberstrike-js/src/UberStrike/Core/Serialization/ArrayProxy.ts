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

import UShortProxy from './UShortProxy';

export default class ArrayProxy {
  static Serialize<T>(bytes: number[], instance: T[], serialization: (bytes: number[], instance: T) => void): void {
    UShortProxy.Serialize(bytes, instance.length as number);

    for (const t of instance) {
      serialization(bytes, t);
    }
  }

  static Deserialize<T>(bytes: number[], serialization: (bytes: number[]) => T): T[] {
    const num = UShortProxy.Deserialize(bytes);
    const array = new Array(num);

    for (let i = 0; i < num; i++) {
      array[i] = serialization(bytes);
    }

    return array;
  }
}
