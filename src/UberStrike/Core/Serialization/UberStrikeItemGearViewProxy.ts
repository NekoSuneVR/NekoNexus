import { ItemPropertyType } from '@/Cmune/DataCenter/Common/Entities';
import { ItemPrice, UberStrikeItemGearView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import BooleanProxy from './BooleanProxy';
import DictionaryProxy from './DictionaryProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ItemPriceProxy from './ItemPriceProxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class UberStrikeItemGearViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemGearView) {
    let num = 0;

    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.ArmorPoints);
    Int32Proxy.Serialize(memoryStream, instance.ArmorWeight);

    if (instance.CustomProperties) {
      DictionaryProxy.Serialize<string, string>(memoryStream, instance.CustomProperties, StringProxy.Serialize, StringProxy.Serialize);
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

    if (instance.ItemProperties) {
      DictionaryProxy.Serialize<ItemPropertyType, int>(memoryStream, instance.ItemProperties, EnumProxy.Serialize<ItemPropertyType>, Int32Proxy.Serialize);
    } else {
      num |= 4;
    }

    Int32Proxy.Serialize(memoryStream, instance.LevelLock);
    Int32Proxy.Serialize(memoryStream, instance.MaxDurationDays);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 8;
    }

    if (instance.PrefabName) {
      StringProxy.Serialize(memoryStream, instance.PrefabName);
    } else {
      num |= 16;
    }

    if (instance.Prices) {
      ListProxy.Serialize<ItemPrice>(memoryStream, instance.Prices, ItemPriceProxy.Serialize);
    } else {
      num |= 32;
    }

    EnumProxy.Serialize<ItemShopHighlightType>(memoryStream, instance.ShopHighlightType);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): UberStrikeItemGearView {
    const num = Int32Proxy.Deserialize(bytes);
    const uberStrikeItemGearView = new UberStrikeItemGearView();
    uberStrikeItemGearView.ArmorPoints = Int32Proxy.Deserialize(bytes);
    uberStrikeItemGearView.ArmorWeight = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      uberStrikeItemGearView.CustomProperties = DictionaryProxy.Deserialize<string, string>(bytes, StringProxy.Deserialize, StringProxy.Deserialize);
    }

    if ((num & 2) !== 0) {
      uberStrikeItemGearView.Description = StringProxy.Deserialize(bytes);
    }

    uberStrikeItemGearView.ID = Int32Proxy.Deserialize(bytes);
    uberStrikeItemGearView.IsConsumable = BooleanProxy.Deserialize(bytes);
    uberStrikeItemGearView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);

    if ((num & 4) !== 0) {
      uberStrikeItemGearView.ItemProperties = DictionaryProxy.Deserialize<ItemPropertyType, int>(bytes, EnumProxy.Deserialize<ItemPropertyType>, Int32Proxy.Deserialize);
    }

    uberStrikeItemGearView.LevelLock = Int32Proxy.Deserialize(bytes);
    uberStrikeItemGearView.MaxDurationDays = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      uberStrikeItemGearView.Name = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      uberStrikeItemGearView.PrefabName = StringProxy.Deserialize(bytes);
    }

    if ((num & 32) !== 0) {
      uberStrikeItemGearView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
    }

    uberStrikeItemGearView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);

    return uberStrikeItemGearView;
  }
}
