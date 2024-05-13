import { ItemPropertyType } from '@/Cmune/DataCenter/Common/Entities';
import { ItemPrice, UberStrikeItemFunctionalView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import BooleanProxy from './BooleanProxy';
import DictionaryProxy from './DictionaryProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ItemPriceProxy from './ItemPriceProxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class UberStrikeItemFunctionalViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemFunctionalView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
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

    if (instance.ItemProperties) {
      DictionaryProxy.Serialize<ItemPropertyType, int>(
        memoryStream,
        instance.ItemProperties,
        EnumProxy.Serialize<ItemPropertyType>,
        Int32Proxy.Serialize,
      );
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

  public static Deserialize(bytes: Stream): UberStrikeItemFunctionalView {
    const num = Int32Proxy.Deserialize(bytes);
    const uberStrikeItemFunctionalView = new UberStrikeItemFunctionalView();

    if ((num & 1) !== 0) {
      uberStrikeItemFunctionalView.CustomProperties = DictionaryProxy.Deserialize<string, string>(
        bytes,
        StringProxy.Deserialize,
        StringProxy.Deserialize,
      );
    }

    if ((num & 2) !== 0) {
      uberStrikeItemFunctionalView.Description = StringProxy.Deserialize(bytes);
    }

    uberStrikeItemFunctionalView.ID = Int32Proxy.Deserialize(bytes);
    uberStrikeItemFunctionalView.IsConsumable = BooleanProxy.Deserialize(bytes);
    uberStrikeItemFunctionalView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);

    if ((num & 4) !== 0) {
      uberStrikeItemFunctionalView.ItemProperties = DictionaryProxy.Deserialize<ItemPropertyType, int>(
        bytes,
        EnumProxy.Deserialize<ItemPropertyType>,
        Int32Proxy.Deserialize,
      );
    }

    uberStrikeItemFunctionalView.LevelLock = Int32Proxy.Deserialize(bytes);
    uberStrikeItemFunctionalView.MaxDurationDays = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      uberStrikeItemFunctionalView.Name = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      uberStrikeItemFunctionalView.PrefabName = StringProxy.Deserialize(bytes);
    }

    if ((num & 32) !== 0) {
      uberStrikeItemFunctionalView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
    }

    uberStrikeItemFunctionalView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);

    return uberStrikeItemFunctionalView;
  }
}
