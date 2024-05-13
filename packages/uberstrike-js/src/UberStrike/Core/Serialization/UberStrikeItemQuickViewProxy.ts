import { ItemPropertyType } from '@/Cmune/DataCenter/Common/Entities';
import { ItemPrice, UberStrikeItemQuickView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, QuickItemLogic, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import { BooleanProxy } from '.';
import DictionaryProxy from './DictionaryProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ItemPriceProxy from './ItemPriceProxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class UberStrikeItemQuickViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemQuickView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    EnumProxy.Serialize<QuickItemLogic>(memoryStream, instance.BehaviourType);
    Int32Proxy.Serialize(memoryStream, instance.CoolDownTime);

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
    Int32Proxy.Serialize(memoryStream, instance.MaxOwnableAmount);

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
    Int32Proxy.Serialize(memoryStream, instance.UsesPerGame);
    Int32Proxy.Serialize(memoryStream, instance.UsesPerLife);
    Int32Proxy.Serialize(memoryStream, instance.UsesPerRound);
    Int32Proxy.Serialize(memoryStream, instance.WarmUpTime);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): UberStrikeItemQuickView {
    const num = Int32Proxy.Deserialize(bytes);
    const uberStrikeItemQuickView = new UberStrikeItemQuickView();
    uberStrikeItemQuickView.BehaviourType = EnumProxy.Deserialize<QuickItemLogic>(bytes);
    uberStrikeItemQuickView.CoolDownTime = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      uberStrikeItemQuickView.CustomProperties = DictionaryProxy.Deserialize<string, string>(
        bytes,
        StringProxy.Deserialize,
        StringProxy.Deserialize,
      );
    }

    if ((num & 2) !== 0) {
      uberStrikeItemQuickView.Description = StringProxy.Deserialize(bytes);
    }

    uberStrikeItemQuickView.ID = Int32Proxy.Deserialize(bytes);
    uberStrikeItemQuickView.IsConsumable = BooleanProxy.Deserialize(bytes);
    uberStrikeItemQuickView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);

    if ((num & 4) !== 0) {
      uberStrikeItemQuickView.ItemProperties = DictionaryProxy.Deserialize<ItemPropertyType, int>(
        bytes,
        EnumProxy.Deserialize<ItemPropertyType>,
        Int32Proxy.Deserialize,
      );
    }

    uberStrikeItemQuickView.LevelLock = Int32Proxy.Deserialize(bytes);
    uberStrikeItemQuickView.MaxDurationDays = Int32Proxy.Deserialize(bytes);
    uberStrikeItemQuickView.MaxOwnableAmount = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      uberStrikeItemQuickView.Name = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      uberStrikeItemQuickView.PrefabName = StringProxy.Deserialize(bytes);
    }

    if ((num & 32) !== 0) {
      uberStrikeItemQuickView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
    }

    uberStrikeItemQuickView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);
    uberStrikeItemQuickView.UsesPerGame = Int32Proxy.Deserialize(bytes);
    uberStrikeItemQuickView.UsesPerLife = Int32Proxy.Deserialize(bytes);
    uberStrikeItemQuickView.UsesPerRound = Int32Proxy.Deserialize(bytes);
    uberStrikeItemQuickView.WarmUpTime = Int32Proxy.Deserialize(bytes);

    return uberStrikeItemQuickView;
  }
}
