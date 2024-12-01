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

export default class DictionaryProxy {
  static Serialize<S extends string | number, T>(
    bytes: number[],
    instance: Record<S, T>,
    keySerialization: (bytes: number[], instance: S) => void,
    valueSerialization: (bytes: number[], instance: T) => void,
  ): void {
    Int32Proxy.Serialize(bytes, Object.keys(instance).length);

    for (const [key, value] of Object.entries(instance)) {
      keySerialization(bytes, key as S);
      valueSerialization(bytes, value as T);
    }
  }

  static Deserialize<S extends string | number, T>(
    bytes: number[],
    keySerialization: (bytes: number[]) => S,
    valueSerialization: (bytes: number[]) => T,
  ): Record<S, T> {
    const num = Int32Proxy.Deserialize(bytes);
    const dictionary: { [key: string | number]: any } = {};

    for (let i = 0; i < num; i++) {
      dictionary[keySerialization(bytes) as string] = valueSerialization(bytes);
    }

    return dictionary as Record<S, T>;
  }
}
