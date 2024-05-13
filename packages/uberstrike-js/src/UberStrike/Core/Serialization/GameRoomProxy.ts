import { GameRoom } from '@/UberStrike/Core/Models';
import ConnectionAddressProxy from './ConnectionAddressProxy';
import Int32Proxy from './Int32Proxy';

export default class GameRoomProxy {
  public static Serialize(stream: Stream, instance: GameRoom): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.MapId);
    Int32Proxy.Serialize(memoryStream, instance.Number);

    if (instance.Server) {
      ConnectionAddressProxy.Serialize(memoryStream, instance.Server);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): GameRoom {
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
