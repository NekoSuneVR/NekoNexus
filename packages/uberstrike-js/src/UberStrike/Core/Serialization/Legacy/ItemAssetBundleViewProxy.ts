import { ItemAssetBundleView } from '@/UberStrike/Core/Models/Views';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class ItemAssetBundleViewProxy {
  public static Serialize(stream: Stream, instance: ItemAssetBundleView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.Url) {
        StringProxy.Serialize(memoryStream, instance.Url);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ItemAssetBundleView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let itemAssetBundleView: ItemAssetBundleView | null = null;
    if (num !== 0) {
      itemAssetBundleView = new ItemAssetBundleView();
      if ((num & 1) !== 0) {
        itemAssetBundleView.Url = StringProxy.Deserialize(bytes);
      }
    }
    return itemAssetBundleView;
  }
}
