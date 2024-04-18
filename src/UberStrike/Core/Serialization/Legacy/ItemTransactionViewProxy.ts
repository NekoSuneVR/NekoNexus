import { BuyingDurationType, ItemTransactionView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class ItemTransactionViewProxy {
  public static Serialize(stream: Stream, instance: ItemTransactionView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      Int32Proxy.Serialize(memoryStream, instance.Credits);
      EnumProxy.Serialize<BuyingDurationType>(memoryStream, instance.Duration);
      BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
      Int32Proxy.Serialize(memoryStream, instance.ItemId);
      Int32Proxy.Serialize(memoryStream, instance.Points);
      DateTimeProxy.Serialize(memoryStream, instance.WithdrawalDate);
      Int32Proxy.Serialize(memoryStream, instance.WithdrawalId);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ItemTransactionView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let itemTransactionView: ItemTransactionView | null = null;
    if (num !== 0) {
      itemTransactionView = new ItemTransactionView();
      itemTransactionView.Cmid = Int32Proxy.Deserialize(bytes);
      itemTransactionView.Credits = Int32Proxy.Deserialize(bytes);
      itemTransactionView.Duration = EnumProxy.Deserialize<BuyingDurationType>(bytes);
      itemTransactionView.IsAdminAction = BooleanProxy.Deserialize(bytes);
      itemTransactionView.ItemId = Int32Proxy.Deserialize(bytes);
      itemTransactionView.Points = Int32Proxy.Deserialize(bytes);
      itemTransactionView.WithdrawalDate = DateTimeProxy.Deserialize(bytes);
      itemTransactionView.WithdrawalId = Int32Proxy.Deserialize(bytes);
    }
    return itemTransactionView;
  }
}
