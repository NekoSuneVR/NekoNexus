import { PlayerLevelCapView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class PlayerLevelCapViewProxy {
  public static Serialize(stream: Stream, instance: PlayerLevelCapView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Level);
      Int32Proxy.Serialize(memoryStream, instance.PlayerLevelCapId);
      Int32Proxy.Serialize(memoryStream, instance.XPRequired);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): PlayerLevelCapView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let playerLevelCapView: PlayerLevelCapView | null = null;
    if (num !== 0) {
      playerLevelCapView = new PlayerLevelCapView();
      playerLevelCapView.Level = Int32Proxy.Deserialize(bytes);
      playerLevelCapView.PlayerLevelCapId = Int32Proxy.Deserialize(bytes);
      playerLevelCapView.XPRequired = Int32Proxy.Deserialize(bytes);
    }
    return playerLevelCapView;
  }
}
