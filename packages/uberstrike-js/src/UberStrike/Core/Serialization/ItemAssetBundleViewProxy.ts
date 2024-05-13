import { ItemAssetBundleView } from '@/UberStrike/Core/Models/Views';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class ItemAssetBundleViewProxy {
  public static Serialize(stream: Stream, instance: ItemAssetBundleView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    if (instance.Url) {
      StringProxy.Serialize(memoryStream, instance.Url);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ItemAssetBundleView {
    const num = Int32Proxy.Deserialize(bytes);
    const itemAssetBundleView = new ItemAssetBundleView();

    if ((num & 1) !== 0) {
      itemAssetBundleView.Url = StringProxy.Deserialize(bytes);
    }

    return itemAssetBundleView;
  }
}
