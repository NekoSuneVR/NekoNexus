import { MysteryBoxWonItemUnityView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from './Int32Proxy';

export default class MysteryBoxWonItemUnityViewProxy {
  public static Serialize(stream: Stream, instance: MysteryBoxWonItemUnityView): void {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.CreditWon);
    Int32Proxy.Serialize(memoryStream, instance.ItemIdWon);
    Int32Proxy.Serialize(memoryStream, instance.PointWon);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): MysteryBoxWonItemUnityView {
    return new MysteryBoxWonItemUnityView({
      CreditWon: Int32Proxy.Deserialize(bytes),
      ItemIdWon: Int32Proxy.Deserialize(bytes),
      PointWon: Int32Proxy.Deserialize(bytes),
    });
  }
}
