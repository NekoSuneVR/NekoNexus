import {
  BundleCategoryType,
  BundleItemView,
  MysteryBoxUnityView,
  UberStrikeCurrencyType,
} from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import BundleItemViewProxy from './BundleItemViewProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class MysteryBoxUnityViewProxy {
  public static Serialize(stream: Stream, instance: MysteryBoxUnityView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    EnumProxy.Serialize<BundleCategoryType>(memoryStream, instance.Category);
    Int32Proxy.Serialize(memoryStream, instance.CreditsAttributed);
    Int32Proxy.Serialize(memoryStream, instance.CreditsAttributedWeight);

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 1;
    }

    BooleanProxy.Serialize(memoryStream, instance.ExposeItemsToPlayers);

    if (instance.IconUrl) {
      StringProxy.Serialize(memoryStream, instance.IconUrl);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.Id);

    if (instance.ImageUrl) {
      StringProxy.Serialize(memoryStream, instance.ImageUrl);
    } else {
      num |= 4;
    }

    BooleanProxy.Serialize(memoryStream, instance.IsAvailableInShop);
    Int32Proxy.Serialize(memoryStream, instance.ItemsAttributed);

    if (instance.MysteryBoxItems) {
      ListProxy.Serialize<BundleItemView>(memoryStream, instance.MysteryBoxItems, BundleItemViewProxy.Serialize);
    } else {
      num |= 8;
    }

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 16;
    }

    Int32Proxy.Serialize(memoryStream, instance.PointsAttributed);
    Int32Proxy.Serialize(memoryStream, instance.PointsAttributedWeight);
    Int32Proxy.Serialize(memoryStream, instance.Price);
    EnumProxy.Serialize<UberStrikeCurrencyType>(memoryStream, instance.UberStrikeCurrencyType);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): MysteryBoxUnityView {
    const num = Int32Proxy.Deserialize(bytes);
    const mysteryBoxUnityView = new MysteryBoxUnityView();
    mysteryBoxUnityView.Category = EnumProxy.Deserialize<BundleCategoryType>(bytes);
    mysteryBoxUnityView.CreditsAttributed = Int32Proxy.Deserialize(bytes);
    mysteryBoxUnityView.CreditsAttributedWeight = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      mysteryBoxUnityView.Description = StringProxy.Deserialize(bytes);
    }

    mysteryBoxUnityView.ExposeItemsToPlayers = BooleanProxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      mysteryBoxUnityView.IconUrl = StringProxy.Deserialize(bytes);
    }

    mysteryBoxUnityView.Id = Int32Proxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      mysteryBoxUnityView.ImageUrl = StringProxy.Deserialize(bytes);
    }

    mysteryBoxUnityView.IsAvailableInShop = BooleanProxy.Deserialize(bytes);
    mysteryBoxUnityView.ItemsAttributed = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      mysteryBoxUnityView.MysteryBoxItems = ListProxy.Deserialize<BundleItemView>(
        bytes,
        BundleItemViewProxy.Deserialize,
      );
    }

    if ((num & 16) !== 0) {
      mysteryBoxUnityView.Name = StringProxy.Deserialize(bytes);
    }

    mysteryBoxUnityView.PointsAttributed = Int32Proxy.Deserialize(bytes);
    mysteryBoxUnityView.PointsAttributedWeight = Int32Proxy.Deserialize(bytes);
    mysteryBoxUnityView.Price = Int32Proxy.Deserialize(bytes);
    mysteryBoxUnityView.UberStrikeCurrencyType = EnumProxy.Deserialize<UberStrikeCurrencyType>(bytes);

    return mysteryBoxUnityView;
  }
}
