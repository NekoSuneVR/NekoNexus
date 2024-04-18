import {
  BundleCategoryType, LuckyDrawSetUnityView, LuckyDrawUnityView, UberStrikeCurrencyType
} from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import LuckyDrawSetUnityViewProxy from './LuckyDrawSetUnityViewProxy';
import StringProxy from './StringProxy';

export default class LuckyDrawUnityViewProxy {
  public static Serialize(stream: Stream, instance: LuckyDrawUnityView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    EnumProxy.Serialize<BundleCategoryType>(memoryStream, instance.Category);

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 1;
    }

    if (instance.IconUrl) {
      StringProxy.Serialize(memoryStream, instance.IconUrl);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.Id);
    BooleanProxy.Serialize(memoryStream, instance.IsAvailableInShop);

    if (instance.LuckyDrawSets) {
      ListProxy.Serialize<LuckyDrawSetUnityView>(memoryStream, instance.LuckyDrawSets, LuckyDrawSetUnityViewProxy.Serialize);
    } else {
      num |= 4;
    }

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 8;
    }

    Int32Proxy.Serialize(memoryStream, instance.Price);
    EnumProxy.Serialize<UberStrikeCurrencyType>(memoryStream, instance.UberStrikeCurrencyType);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): LuckyDrawUnityView {
    const num = Int32Proxy.Deserialize(bytes);
    const luckyDrawUnityView = new LuckyDrawUnityView();
    luckyDrawUnityView.Category = EnumProxy.Deserialize<BundleCategoryType>(bytes);

    if ((num & 1) !== 0) {
      luckyDrawUnityView.Description = StringProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      luckyDrawUnityView.IconUrl = StringProxy.Deserialize(bytes);
    }

    luckyDrawUnityView.Id = Int32Proxy.Deserialize(bytes);
    luckyDrawUnityView.IsAvailableInShop = BooleanProxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      luckyDrawUnityView.LuckyDrawSets = ListProxy.Deserialize<LuckyDrawSetUnityView>(bytes, LuckyDrawSetUnityViewProxy.Deserialize);
    }

    if ((num & 8) !== 0) {
      luckyDrawUnityView.Name = StringProxy.Deserialize(bytes);
    }

    luckyDrawUnityView.Price = Int32Proxy.Deserialize(bytes);
    luckyDrawUnityView.UberStrikeCurrencyType = EnumProxy.Deserialize<UberStrikeCurrencyType>(bytes);

    return luckyDrawUnityView;
  }
}
