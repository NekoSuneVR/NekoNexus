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

import { ShortVector3 } from '@/UberStrike/Core/Models';
import Int16Proxy from './Int16Proxy';

export default class ShortVector3Proxy {
  static Serialize(bytes: number[], instance: ShortVector3): void {
    Int16Proxy.Serialize(bytes, Math.clamp(instance.x * 100, -32768, 32767));
    Int16Proxy.Serialize(bytes, Math.clamp(instance.y * 100, -32768, 32767));
    Int16Proxy.Serialize(bytes, Math.clamp(instance.z * 100, -32768, 32767));
  }

  static Deserialize(bytes: number[]): ShortVector3 {
    return new ShortVector3(
      0.01 * Int16Proxy.Deserialize(bytes),
      0.01 * Int16Proxy.Deserialize(bytes),
      0.01 * Int16Proxy.Deserialize(bytes),
    );
  }
}
