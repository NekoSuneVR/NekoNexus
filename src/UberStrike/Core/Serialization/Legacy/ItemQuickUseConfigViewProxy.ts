import { QuickItemLogic } from '@/UberStrike/Core/Types';
import { ItemQuickUseConfigView } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class ItemQuickUseConfigViewProxy {
  public static Serialize(stream: Stream, instance: ItemQuickUseConfigView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      EnumProxy.Serialize<QuickItemLogic>(memoryStream, instance.BehaviourType);
      Int32Proxy.Serialize(memoryStream, instance.CoolDownTime);
      Int32Proxy.Serialize(memoryStream, instance.ItemId);
      Int32Proxy.Serialize(memoryStream, instance.LevelRequired);
      Int32Proxy.Serialize(memoryStream, instance.UsesPerGame);
      Int32Proxy.Serialize(memoryStream, instance.UsesPerLife);
      Int32Proxy.Serialize(memoryStream, instance.UsesPerRound);
      Int32Proxy.Serialize(memoryStream, instance.WarmUpTime);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ItemQuickUseConfigView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let itemQuickUseConfigView: ItemQuickUseConfigView | null = null;
    if (num !== 0) {
      itemQuickUseConfigView = new ItemQuickUseConfigView();
      itemQuickUseConfigView.BehaviourType = EnumProxy.Deserialize<QuickItemLogic>(bytes);
      itemQuickUseConfigView.CoolDownTime = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.ItemId = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.LevelRequired = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.UsesPerGame = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.UsesPerLife = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.UsesPerRound = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.WarmUpTime = Int32Proxy.Deserialize(bytes);
    }
    return itemQuickUseConfigView;
  }
}
