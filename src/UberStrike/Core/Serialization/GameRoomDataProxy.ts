import { GameRoomData } from '@/UberStrike/Core/Models';
import { GameModeType } from '@/UberStrike/Core/Types';
import BooleanProxy from './BooleanProxy';
import ByteProxy from './ByteProxy';
import ConnectionAddressProxy from './ConnectionAddressProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class GameRoomDataProxy {
  public static Serialize(stream: Stream, instance: GameRoomData): void {
    let num = 0;
    const memoryStream: MemoryStream = [];

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
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): GameRoomData {
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
