import { DamageEvent } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import DictionaryProxy from './DictionaryProxy';
import Int32Proxy from './Int32Proxy';
import SingleProxy from './SingleProxy';

export default class DamageEventProxy {
  public static Serialize(stream: Stream, instance: DamageEvent): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
    ByteProxy.Serialize(memoryStream, instance.BodyPartFlag);

    if (instance.Damage) {
      DictionaryProxy.Serialize<byte, byte>(memoryStream, instance.Damage, ByteProxy.Serialize, ByteProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.DamageEffectFlag);
    SingleProxy.Serialize(memoryStream, instance.DamgeEffectValue);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): DamageEvent {
    const num = Int32Proxy.Deserialize(bytes);
    const damageEvent = new DamageEvent();
    damageEvent.BodyPartFlag = ByteProxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      damageEvent.Damage = DictionaryProxy.Deserialize<byte, byte>(bytes, ByteProxy.Deserialize, ByteProxy.Deserialize);
    }

    damageEvent.DamageEffectFlag = Int32Proxy.Deserialize(bytes);
    damageEvent.DamgeEffectValue = SingleProxy.Deserialize(bytes);

    return damageEvent;
  }
}
