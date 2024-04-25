import {
  UberStrikeItemFunctionalView,
  UberStrikeItemGearView,
  UberStrikeItemQuickView,
  UberStrikeItemShopClientView,
  UberStrikeItemWeaponView,
} from '@/UberStrike/Core/Models/Views';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import UberStrikeItemFunctionalViewProxy from './UberStrikeItemFunctionalViewProxy';
import UberStrikeItemGearViewProxy from './UberStrikeItemGearViewProxy';
import UberStrikeItemQuickViewProxy from './UberStrikeItemQuickViewProxy';
import UberStrikeItemWeaponViewProxy from './UberStrikeItemWeaponViewProxy';

export default class UberStrikeItemShopClientViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemShopClientView) {
    let num = 0;

    const memoryStream: MemoryStream = [];
    if (instance.FunctionalItems) {
      ListProxy.Serialize<UberStrikeItemFunctionalView>(
        memoryStream,
        instance.FunctionalItems,
        UberStrikeItemFunctionalViewProxy.Serialize,
      );
    } else {
      num |= 1;
    }

    if (instance.GearItems) {
      ListProxy.Serialize<UberStrikeItemGearView>(
        memoryStream,
        instance.GearItems,
        UberStrikeItemGearViewProxy.Serialize,
      );
    } else {
      num |= 2;
    }

    if (instance.QuickItems) {
      ListProxy.Serialize<UberStrikeItemQuickView>(
        memoryStream,
        instance.QuickItems,
        UberStrikeItemQuickViewProxy.Serialize,
      );
    } else {
      num |= 4;
    }

    if (instance.WeaponItems) {
      ListProxy.Serialize<UberStrikeItemWeaponView>(
        memoryStream,
        instance.WeaponItems,
        UberStrikeItemWeaponViewProxy.Serialize,
      );
    } else {
      num |= 8;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): UberStrikeItemShopClientView {
    const num = Int32Proxy.Deserialize(bytes);
    const uberStrikeItemShopClientView = new UberStrikeItemShopClientView();

    if ((num & 1) !== 0) {
      uberStrikeItemShopClientView.FunctionalItems = ListProxy.Deserialize<UberStrikeItemFunctionalView>(
        bytes,
        UberStrikeItemFunctionalViewProxy.Deserialize,
      );
    }

    if ((num & 2) !== 0) {
      uberStrikeItemShopClientView.GearItems = ListProxy.Deserialize<UberStrikeItemGearView>(
        bytes,
        UberStrikeItemGearViewProxy.Deserialize,
      );
    }

    if ((num & 4) !== 0) {
      uberStrikeItemShopClientView.QuickItems = ListProxy.Deserialize<UberStrikeItemQuickView>(
        bytes,
        UberStrikeItemQuickViewProxy.Deserialize,
      );
    }

    if ((num & 8) !== 0) {
      uberStrikeItemShopClientView.WeaponItems = ListProxy.Deserialize<UberStrikeItemWeaponView>(
        bytes,
        UberStrikeItemWeaponViewProxy.Deserialize,
      );
    }

    return uberStrikeItemShopClientView;
  }
}
