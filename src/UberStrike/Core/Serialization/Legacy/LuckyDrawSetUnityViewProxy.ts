import { BundleItemView, LuckyDrawSetUnityView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import BundleItemViewProxy from './BundleItemViewProxy';

export default class LuckyDrawSetUnityViewProxy {
  public static Serialize(stream: Stream, instance: LuckyDrawSetUnityView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.CreditsAttributed);
      BooleanProxy.Serialize(memoryStream, instance.ExposeItemsToPlayers);
      Int32Proxy.Serialize(memoryStream, instance.Id);
      if (instance.ImageUrl) {
        StringProxy.Serialize(memoryStream, instance.ImageUrl);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.LuckyDrawId);
      if (instance.LuckyDrawSetItems) {
        ListProxy.Serialize<BundleItemView>(memoryStream, instance.LuckyDrawSetItems, BundleItemViewProxy.Serialize);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.PointsAttributed);
      Int32Proxy.Serialize(memoryStream, instance.SetWeight);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): LuckyDrawSetUnityView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let luckyDrawSetUnityView: LuckyDrawSetUnityView | null = null;
    if (num !== 0) {
      luckyDrawSetUnityView = new LuckyDrawSetUnityView();
      luckyDrawSetUnityView.CreditsAttributed = Int32Proxy.Deserialize(bytes);
      luckyDrawSetUnityView.ExposeItemsToPlayers = BooleanProxy.Deserialize(bytes);
      luckyDrawSetUnityView.Id = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        luckyDrawSetUnityView.ImageUrl = StringProxy.Deserialize(bytes);
      }
      luckyDrawSetUnityView.LuckyDrawId = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        luckyDrawSetUnityView.LuckyDrawSetItems = ListProxy.Deserialize<BundleItemView>(bytes, BundleItemViewProxy.Deserialize);
      }
      luckyDrawSetUnityView.PointsAttributed = Int32Proxy.Deserialize(bytes);
      luckyDrawSetUnityView.SetWeight = Int32Proxy.Deserialize(bytes);
    }
    return luckyDrawSetUnityView;
  }
}
