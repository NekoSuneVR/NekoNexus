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

import { PlayerMovement } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import ShortVector3Proxy from './ShortVector3Proxy';

export default class PlayerMovementProxy {
  static Serialize(stream: number[], instance: PlayerMovement): void {
    const memoryStream: number[] = [];
    ByteProxy.Serialize(memoryStream, instance.HorizontalRotation);
    ByteProxy.Serialize(memoryStream, instance.KeyState);
    ByteProxy.Serialize(memoryStream, instance.MovementState);
    ByteProxy.Serialize(memoryStream, instance.Number);
    ShortVector3Proxy.Serialize(memoryStream, instance.Position);
    ShortVector3Proxy.Serialize(memoryStream, instance.Velocity);
    ByteProxy.Serialize(memoryStream, instance.VerticalRotation);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PlayerMovement {
    return new PlayerMovement({
      HorizontalRotation: ByteProxy.Deserialize(bytes),
      KeyState: ByteProxy.Deserialize(bytes),
      MovementState: ByteProxy.Deserialize(bytes),
      Number: ByteProxy.Deserialize(bytes),
      Position: ShortVector3Proxy.Deserialize(bytes),
      Velocity: ShortVector3Proxy.Deserialize(bytes),
      VerticalRotation: ByteProxy.Deserialize(bytes),
    });
  }
}
