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

import { GameRoom } from '@/UberStrike/Core/Models';
import ConnectionAddressProxy from './ConnectionAddressProxy';
import Int32Proxy from './Int32Proxy';

export default class GameRoomProxy {
  static Serialize(stream: number[], instance: GameRoom): void {
    let num = 0;
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.MapId);
    Int32Proxy.Serialize(memoryStream, instance.Number);

    if (instance.Server) {
      ConnectionAddressProxy.Serialize(memoryStream, instance.Server);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): GameRoom {
    const num = Int32Proxy.Deserialize(bytes);
    const gameRoom = new GameRoom();
    gameRoom.MapId = Int32Proxy.Deserialize(bytes);
    gameRoom.Number = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      gameRoom.Server = ConnectionAddressProxy.Deserialize(bytes);
    }

    return gameRoom;
  }
}
