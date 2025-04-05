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

export default class UShortProxy {
  static Serialize(bytes: number[], instance: number): void {
    const bytes2 = Buffer.alloc(2);
    bytes2.writeUInt16LE(Number(instance));

    bytes.push(...new Uint8Array(bytes2));
  }

  static Deserialize(bytes: number[]): number {
    return Buffer.from(bytes.splice(0, 2)).readUInt16LE();
  }
}
