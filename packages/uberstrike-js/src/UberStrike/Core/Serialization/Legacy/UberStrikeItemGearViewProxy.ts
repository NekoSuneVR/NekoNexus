import { ItemPrice, UberStrikeItemGearView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import BooleanProxy from '../BooleanProxy';
import DictionaryProxy from '../DictionaryProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import ItemPriceProxy from './ItemPriceProxy';

export default class UberStrikeItemGearViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemGearView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.ArmorAbsorptionPercent);
      Int32Proxy.Serialize(memoryStream, instance.ArmorPoints);
      Int32Proxy.Serialize(memoryStream, instance.ArmorWeight);
      if (instance.CustomProperties) {
        DictionaryProxy.Serialize<string, string>(
          memoryStream,
          instance.CustomProperties,
          StringProxy.Serialize,
          StringProxy.Serialize,
        );
      } else {
        num |= 1;
      }
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.ID);
      BooleanProxy.Serialize(memoryStream, instance.IsConsumable);
      EnumProxy.Serialize<UberstrikeItemClass>(memoryStream, instance.ItemClass);
      Int32Proxy.Serialize(memoryStream, instance.LevelLock);
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 4;
      }
      if (instance.PrefabName) {
        StringProxy.Serialize(memoryStream, instance.PrefabName);
      } else {
        num |= 8;
      }
      if (instance.Prices) {
        ListProxy.Serialize<ItemPrice>(memoryStream, instance.Prices, ItemPriceProxy.Serialize);
      } else {
        num |= 16;
      }
      EnumProxy.Serialize<ItemShopHighlightType>(memoryStream, instance.ShopHighlightType);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
      return;
    }
    Int32Proxy.Serialize(stream, 0);
  }

  public static Deserialize(bytes: Stream): UberStrikeItemGearView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberStrikeItemGearView: UberStrikeItemGearView | null = null;
    if (num !== 0) {
      uberStrikeItemGearView = new UberStrikeItemGearView();
      uberStrikeItemGearView.ArmorAbsorptionPercent = Int32Proxy.Deserialize(bytes);
      uberStrikeItemGearView.ArmorPoints = Int32Proxy.Deserialize(bytes);
      uberStrikeItemGearView.ArmorWeight = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        uberStrikeItemGearView.CustomProperties = DictionaryProxy.Deserialize<string, string>(
          bytes,
          StringProxy.Deserialize,
          StringProxy.Deserialize,
        );
      }
      if ((num & 2) !== 0) {
        uberStrikeItemGearView.Description = StringProxy.Deserialize(bytes);
      }
      uberStrikeItemGearView.ID = Int32Proxy.Deserialize(bytes);
      uberStrikeItemGearView.IsConsumable = BooleanProxy.Deserialize(bytes);
      uberStrikeItemGearView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);
      uberStrikeItemGearView.LevelLock = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        uberStrikeItemGearView.Name = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        uberStrikeItemGearView.PrefabName = StringProxy.Deserialize(bytes);
      }
      if ((num & 16) !== 0) {
        uberStrikeItemGearView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
      }
      uberStrikeItemGearView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);
    }
    return uberStrikeItemGearView;
  }
}
