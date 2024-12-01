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

import Int64Proxy from './Int64Proxy';

const epochTicks = 621355968000000000n;

export default class DateTimeProxy {
  static Serialize(bytes: number[], instance: Date): void {
    Int64Proxy.Serialize(bytes, BigInt(instance.getTime() * 10000) + epochTicks);
  }

  static Deserialize(bytes: number[]): Date {
    return new Date(Number((Int64Proxy.Deserialize(bytes) - epochTicks) / 10000n));
  }
}
