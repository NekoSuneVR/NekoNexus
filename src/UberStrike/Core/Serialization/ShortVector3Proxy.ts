import { ShortVector3 } from '@/UberStrike/Core/Models';
import Int16Proxy from './Int16Proxy';

export default class ShortVector3Proxy {
  public static Serialize(bytes: Stream, instance: ShortVector3): void {
    Int16Proxy.Serialize(bytes, Math.clamp(instance.x * 100, -32768, 32767));
    Int16Proxy.Serialize(bytes, Math.clamp(instance.y * 100, -32768, 32767));
    Int16Proxy.Serialize(bytes, Math.clamp(instance.z * 100, -32768, 32767));
  }

  public static Deserialize(bytes: Stream): ShortVector3 {
    return new ShortVector3(0.01 * Int16Proxy.Deserialize(bytes), 0.01 * Int16Proxy.Deserialize(bytes), 0.01 * Int16Proxy.Deserialize(bytes));
  }
}
