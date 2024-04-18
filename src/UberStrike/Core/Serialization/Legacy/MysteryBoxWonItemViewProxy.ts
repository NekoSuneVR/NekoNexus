import { MysteryBoxWonItemUnityView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class MysteryBoxWonItemUnityViewProxy {
  public static Serialize(stream: Stream, instance: MysteryBoxWonItemUnityView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.CreditWon);
      Int32Proxy.Serialize(memoryStream, instance.ItemIdWon);
      Int32Proxy.Serialize(memoryStream, instance.PointWon);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MysteryBoxWonItemUnityView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let mysteryBoxWonItemUnityView: MysteryBoxWonItemUnityView | null = null;
    if (num !== 0) {
      mysteryBoxWonItemUnityView = new MysteryBoxWonItemUnityView();
      mysteryBoxWonItemUnityView.CreditWon = Int32Proxy.Deserialize(bytes);
      mysteryBoxWonItemUnityView.ItemIdWon = Int32Proxy.Deserialize(bytes);
      mysteryBoxWonItemUnityView.PointWon = Int32Proxy.Deserialize(bytes);
    }
    return mysteryBoxWonItemUnityView;
  }
}
