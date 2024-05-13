import { BuyingDurationType, ItemTransactionView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';

export default class ItemTransactionViewProxy {
  public static Serialize(stream: Stream, instance: ItemTransactionView): void {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Credits);
    EnumProxy.Serialize<BuyingDurationType>(memoryStream, instance.Duration);
    BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
    Int32Proxy.Serialize(memoryStream, instance.ItemId);
    Int32Proxy.Serialize(memoryStream, instance.Points);
    DateTimeProxy.Serialize(memoryStream, instance.WithdrawalDate);
    Int32Proxy.Serialize(memoryStream, instance.WithdrawalId);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ItemTransactionView {
    return new ItemTransactionView({
      Cmid: Int32Proxy.Deserialize(bytes),
      Credits: Int32Proxy.Deserialize(bytes),
      Duration: EnumProxy.Deserialize<BuyingDurationType>(bytes),
      IsAdminAction: BooleanProxy.Deserialize(bytes),
      ItemId: Int32Proxy.Deserialize(bytes),
      Points: Int32Proxy.Deserialize(bytes),
      WithdrawalDate: DateTimeProxy.Deserialize(bytes),
      WithdrawalId: Int32Proxy.Deserialize(bytes),
    });
  }
}
