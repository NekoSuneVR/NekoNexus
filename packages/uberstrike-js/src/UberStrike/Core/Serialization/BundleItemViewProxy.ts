import { BundleItemView, BuyingDurationType } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';

export default class BundleItemViewProxy {
  public static Serialize(stream: Stream, instance: BundleItemView): void {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.Amount);
    Int32Proxy.Serialize(memoryStream, instance.BundleId);
    EnumProxy.Serialize<BuyingDurationType>(memoryStream, instance.Duration);
    Int32Proxy.Serialize(memoryStream, instance.ItemId);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): BundleItemView {
    return new BundleItemView({
      Amount: Int32Proxy.Deserialize(bytes),
      BundleId: Int32Proxy.Deserialize(bytes),
      Duration: EnumProxy.Deserialize<BuyingDurationType>(bytes),
      ItemId: Int32Proxy.Deserialize(bytes),
    });
  }
}
