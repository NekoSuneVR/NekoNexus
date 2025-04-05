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

import { GameRoomData } from '@/UberStrike/Core/Models';
import { GameModeType } from '@/UberStrike/Core/Types';
import BooleanProxy from './BooleanProxy';
import ByteProxy from './ByteProxy';
import ConnectionAddressProxy from './ConnectionAddressProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class GameRoomDataProxy {
  static Serialize(stream: number[], instance: GameRoomData): void {
    let num = 0;
    const memoryStream: number[] = [];

    Int32Proxy.Serialize(memoryStream, instance.ConnectedPlayers);
    Int32Proxy.Serialize(memoryStream, instance.GameFlags);
    EnumProxy.Serialize<GameModeType>(memoryStream, instance.GameMode);

    if (instance.Guid) {
      StringProxy.Serialize(memoryStream, instance.Guid);
    } else {
      num |= 1;
    }

    BooleanProxy.Serialize(memoryStream, instance.IsPasswordProtected);
    BooleanProxy.Serialize(memoryStream, instance.IsPermanentGame);
    Int32Proxy.Serialize(memoryStream, instance.KillLimit);
    ByteProxy.Serialize(memoryStream, instance.LevelMax);
    ByteProxy.Serialize(memoryStream, instance.LevelMin);
    Int32Proxy.Serialize(memoryStream, instance.MapID);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.Number);
    Int32Proxy.Serialize(memoryStream, instance.PlayerLimit);

    if (instance.Server) {
      ConnectionAddressProxy.Serialize(memoryStream, instance.Server);
    } else {
      num |= 4;
    }

    Int32Proxy.Serialize(memoryStream, instance.TimeLimit);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): GameRoomData {
    const num = Int32Proxy.Deserialize(bytes);
    const gameRoomData = new GameRoomData();
    gameRoomData.ConnectedPlayers = Int32Proxy.Deserialize(bytes);
    gameRoomData.GameFlags = Int32Proxy.Deserialize(bytes);
    gameRoomData.GameMode = EnumProxy.Deserialize<GameModeType>(bytes);

    if ((num & 1) !== 0) {
      gameRoomData.Guid = StringProxy.Deserialize(bytes);
    }

    gameRoomData.IsPasswordProtected = BooleanProxy.Deserialize(bytes);
    gameRoomData.IsPermanentGame = BooleanProxy.Deserialize(bytes);
    gameRoomData.KillLimit = Int32Proxy.Deserialize(bytes);
    gameRoomData.LevelMax = ByteProxy.Deserialize(bytes);
    gameRoomData.LevelMin = ByteProxy.Deserialize(bytes);
    gameRoomData.MapID = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      gameRoomData.Name = StringProxy.Deserialize(bytes);
    }

    gameRoomData.Number = Int32Proxy.Deserialize(bytes);
    gameRoomData.PlayerLimit = Int32Proxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      gameRoomData.Server = ConnectionAddressProxy.Deserialize(bytes);
    }

    gameRoomData.TimeLimit = Int32Proxy.Deserialize(bytes);

    return gameRoomData;
  }
}
