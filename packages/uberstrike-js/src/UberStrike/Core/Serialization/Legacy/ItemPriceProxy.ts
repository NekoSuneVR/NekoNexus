import { BuyingDurationType, PackType, UberStrikeCurrencyType } from '@/Cmune/DataCenter/Common/Entities';
import { ItemPrice } from '@/UberStrike/Core/Models/Views';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class ItemPriceProxy {
  public static Serialize(stream: Stream, instance: ItemPrice): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Amount);
      EnumProxy.Serialize<UberStrikeCurrencyType>(memoryStream, instance.Currency);
      Int32Proxy.Serialize(memoryStream, instance.Discount);
      EnumProxy.Serialize<BuyingDurationType>(memoryStream, instance.Duration);
      EnumProxy.Serialize<PackType>(memoryStream, instance.PackType);
      Int32Proxy.Serialize(memoryStream, instance.Price);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ItemPrice | null {
    const num = Int32Proxy.Deserialize(bytes);
    let itemPrice: ItemPrice | null = null;
    if (num !== 0) {
      itemPrice = new ItemPrice();
      itemPrice.Amount = Int32Proxy.Deserialize(bytes);
      itemPrice.Currency = EnumProxy.Deserialize<UberStrikeCurrencyType>(bytes);
      itemPrice.Discount = Int32Proxy.Deserialize(bytes);
      itemPrice.Duration = EnumProxy.Deserialize<BuyingDurationType>(bytes);
      itemPrice.PackType = EnumProxy.Deserialize<PackType>(bytes);
      itemPrice.Price = Int32Proxy.Deserialize(bytes);
    }
    return itemPrice;
  }
}
