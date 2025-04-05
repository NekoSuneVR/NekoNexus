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

export default class Int64Proxy {
  static Serialize(bytes: number[], instance: bigint): void {
    const bytes2 = Buffer.alloc(8);
    bytes2.writeBigInt64LE(BigInt(instance ?? 0));

    bytes.push(...new Uint8Array(bytes2));
  }

  static Deserialize(bytes: number[]): bigint {
    const array = Uint8Array.from(bytes.splice(0, 8));

    return Buffer.from(array).readBigInt64LE();
  }
}
