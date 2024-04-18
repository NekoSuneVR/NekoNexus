import { ItemInventoryView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from './DateTimeProxy';
import Int32Proxy from './Int32Proxy';

export default class ItemInventoryViewProxy {
  public static Serialize(stream: Stream, instance: ItemInventoryView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.AmountRemaining);
    Int32Proxy.Serialize(memoryStream, instance.Cmid);

    if (instance.ExpirationDate) {
      DateTimeProxy.Serialize(memoryStream, instance.ExpirationDate);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.ItemId);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ItemInventoryView {
    const num = Int32Proxy.Deserialize(bytes);
    const itemInventoryView = new ItemInventoryView();
    itemInventoryView.AmountRemaining = Int32Proxy.Deserialize(bytes);
    itemInventoryView.Cmid = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      itemInventoryView.ExpirationDate = DateTimeProxy.Deserialize(bytes);
    }

    itemInventoryView.ItemId = Int32Proxy.Deserialize(bytes);

    return itemInventoryView;
  }
}
