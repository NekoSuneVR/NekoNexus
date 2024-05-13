import { BundleItemView, BuyingDurationType } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class BundleItemViewProxy {
  public static Serialize(stream: Stream, instance: BundleItemView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Amount);
      Int32Proxy.Serialize(memoryStream, instance.BundleId);
      EnumProxy.Serialize<BuyingDurationType>(memoryStream, instance.Duration);
      Int32Proxy.Serialize(memoryStream, instance.ItemId);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): BundleItemView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let bundleItemView: BundleItemView | null = null;
    if (num !== 0) {
      bundleItemView = new BundleItemView();
      bundleItemView.Amount = Int32Proxy.Deserialize(bytes);
      bundleItemView.BundleId = Int32Proxy.Deserialize(bytes);
      bundleItemView.Duration = EnumProxy.Deserialize<BuyingDurationType>(bytes);
      bundleItemView.ItemId = Int32Proxy.Deserialize(bytes);
    }
    return bundleItemView;
  }
}
