import {
  UberStrikeItemFunctionalView, UberStrikeItemGearView, UberStrikeItemQuickView, UberStrikeItemShopClientView, UberStrikeItemWeaponView,
} from '@/UberStrike/Core/Models/Views';
import DictionaryProxy from '../DictionaryProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import UberStrikeItemFunctionalViewProxy from './UberStrikeItemFunctionalViewProxy';
import UberStrikeItemGearViewProxy from './UberStrikeItemGearViewProxy';
import UberStrikeItemQuickViewProxy from './UberStrikeItemQuickViewProxy';
import UberStrikeItemWeaponViewProxy from './UberStrikeItemWeaponViewProxy';

export default class UberStrikeItemShopClientViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemShopClientView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.FunctionalItems) {
        ListProxy.Serialize<UberStrikeItemFunctionalView>(memoryStream, instance.FunctionalItems, UberStrikeItemFunctionalViewProxy.Serialize);
      } else {
        num |= 1;
      }
      if (instance.GearItems) {
        ListProxy.Serialize<UberStrikeItemGearView>(memoryStream, instance.GearItems, UberStrikeItemGearViewProxy.Serialize);
      } else {
        num |= 2;
      }
      if (instance.ItemsRecommendationPerMap) {
        DictionaryProxy.Serialize<int, int>(memoryStream, instance.ItemsRecommendationPerMap, Int32Proxy.Serialize, Int32Proxy.Serialize);
      } else {
        num |= 4;
      }
      if (instance.QuickItems) {
        ListProxy.Serialize<UberStrikeItemQuickView>(memoryStream, instance.QuickItems, UberStrikeItemQuickViewProxy.Serialize);
      } else {
        num |= 8;
      }
      if (instance.WeaponItems) {
        ListProxy.Serialize<UberStrikeItemWeaponView>(memoryStream, instance.WeaponItems, UberStrikeItemWeaponViewProxy.Serialize);
      } else {
        num |= 16;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
      return;
    }
    Int32Proxy.Serialize(stream, 0);
  }

  public static Deserialize(bytes: Stream): UberStrikeItemShopClientView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberStrikeItemShopClientView: UberStrikeItemShopClientView | null = null;
    if (num !== 0) {
      uberStrikeItemShopClientView = new UberStrikeItemShopClientView();
      if ((num & 1) !== 0) {
        uberStrikeItemShopClientView.FunctionalItems = ListProxy.Deserialize<UberStrikeItemFunctionalView>(bytes, UberStrikeItemFunctionalViewProxy.Deserialize);
      }
      if ((num & 2) !== 0) {
        uberStrikeItemShopClientView.GearItems = ListProxy.Deserialize<UberStrikeItemGearView>(bytes, UberStrikeItemGearViewProxy.Deserialize);
      }
      if ((num & 4) !== 0) {
        uberStrikeItemShopClientView.ItemsRecommendationPerMap = DictionaryProxy.Deserialize<int, int>(bytes, Int32Proxy.Deserialize, Int32Proxy.Deserialize);
      }
      if ((num & 8) !== 0) {
        uberStrikeItemShopClientView.QuickItems = ListProxy.Deserialize<UberStrikeItemQuickView>(bytes, UberStrikeItemQuickViewProxy.Deserialize);
      }
      if ((num & 16) !== 0) {
        uberStrikeItemShopClientView.WeaponItems = ListProxy.Deserialize<UberStrikeItemWeaponView>(bytes, UberStrikeItemWeaponViewProxy.Deserialize);
      }
    }
    return uberStrikeItemShopClientView;
  }
}
