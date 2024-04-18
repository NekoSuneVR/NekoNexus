import { ItemPrice, UberStrikeItemFunctionalView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import BooleanProxy from '../BooleanProxy';
import DictionaryProxy from '../DictionaryProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import ItemPriceProxy from './ItemPriceProxy';

export default class UberStrikeItemFunctionalViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemFunctionalView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
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

  public static Deserialize(bytes: Stream): UberStrikeItemFunctionalView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberStrikeItemFunctionalView: UberStrikeItemFunctionalView | null = null;
    if (num !== 0) {
      uberStrikeItemFunctionalView = new UberStrikeItemFunctionalView();
      if ((num & 1) !== 0) {
        uberStrikeItemFunctionalView.CustomProperties = DictionaryProxy.Deserialize<string, string>(bytes, StringProxy.Deserialize, StringProxy.Deserialize);
      }
      if ((num & 2) !== 0) {
        uberStrikeItemFunctionalView.Description = StringProxy.Deserialize(bytes);
      }
      uberStrikeItemFunctionalView.ID = Int32Proxy.Deserialize(bytes);
      uberStrikeItemFunctionalView.IsConsumable = BooleanProxy.Deserialize(bytes);
      uberStrikeItemFunctionalView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);
      uberStrikeItemFunctionalView.LevelLock = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        uberStrikeItemFunctionalView.Name = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        uberStrikeItemFunctionalView.PrefabName = StringProxy.Deserialize(bytes);
      }
      if ((num & 16) !== 0) {
        uberStrikeItemFunctionalView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
      }
      uberStrikeItemFunctionalView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);
    }
    return uberStrikeItemFunctionalView;
  }
}
