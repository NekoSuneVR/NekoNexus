import { QuickItemLogic } from '@/UberStrike/Core/Types';
import { ItemQuickUseConfigView } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';

export default class ItemQuickUseConfigViewProxy {
  public static Serialize(stream: Stream, instance: ItemQuickUseConfigView): void {
    const memoryStream: MemoryStream = [];
    EnumProxy.Serialize<QuickItemLogic>(memoryStream, instance.BehaviourType);
    Int32Proxy.Serialize(memoryStream, instance.CoolDownTime);
    Int32Proxy.Serialize(memoryStream, instance.ItemId);
    Int32Proxy.Serialize(memoryStream, instance.LevelRequired);
    Int32Proxy.Serialize(memoryStream, instance.UsesPerGame);
    Int32Proxy.Serialize(memoryStream, instance.UsesPerLife);
    Int32Proxy.Serialize(memoryStream, instance.UsesPerRound);
    Int32Proxy.Serialize(memoryStream, instance.WarmUpTime);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ItemQuickUseConfigView {
    return new ItemQuickUseConfigView({
      BehaviourType: EnumProxy.Deserialize(bytes),
      CoolDownTime: Int32Proxy.Deserialize(bytes),
      ItemId: Int32Proxy.Deserialize(bytes),
      LevelRequired: Int32Proxy.Deserialize(bytes),
      UsesPerGame: Int32Proxy.Deserialize(bytes),
      UsesPerLife: Int32Proxy.Deserialize(bytes),
      UsesPerRound: Int32Proxy.Deserialize(bytes),
      WarmUpTime: Int32Proxy.Deserialize(bytes),
    });
  }
}
