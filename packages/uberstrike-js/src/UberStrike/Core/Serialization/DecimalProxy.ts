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

import Int32Proxy from './Int32Proxy';

export default class DecimalProxy {
  static Serialize(bytes: number[], instance: number): void {
    // JavaScript does not support the max value of number, so we fake it using simple integers
    Int32Proxy.Serialize(bytes, Number(instance));
    Int32Proxy.Serialize(bytes, 0);
    Int32Proxy.Serialize(bytes, 0);
    Int32Proxy.Serialize(bytes, 0);
  }

  static Deserialize(bytes: number[]): number {
    const array = [
      Int32Proxy.Deserialize(bytes),
      Int32Proxy.Deserialize(bytes),
      Int32Proxy.Deserialize(bytes),
      Int32Proxy.Deserialize(bytes),
    ];

    return array[0];
  }
}
