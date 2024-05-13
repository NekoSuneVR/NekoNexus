import { PlayerXPEventView } from '@/UberStrike/DataCenter/Common/Entities';
import DecimalProxy from './DecimalProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class PlayerXPEventViewProxy {
  public static Serialize(stream: Stream, instance: PlayerXPEventView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.PlayerXPEventId);
    DecimalProxy.Serialize(memoryStream, instance.XPMultiplier);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): PlayerXPEventView {
    const num = Int32Proxy.Deserialize(bytes);
    const playerXPEventView = new PlayerXPEventView();

    if ((num & 1) !== 0) {
      playerXPEventView.Name = StringProxy.Deserialize(bytes);
    }

    playerXPEventView.PlayerXPEventId = Int32Proxy.Deserialize(bytes);
    playerXPEventView.XPMultiplier = DecimalProxy.Deserialize(bytes);

    return playerXPEventView;
  }
}
