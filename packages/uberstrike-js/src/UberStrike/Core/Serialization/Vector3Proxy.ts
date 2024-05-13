import Int32Proxy from './Int32Proxy';

export default class Vector3Proxy {
  public static Serialize(bytes: Stream, instance: Vector3): void {
    Int32Proxy.Serialize(bytes, instance.x);
    Int32Proxy.Serialize(bytes, instance.y);
    Int32Proxy.Serialize(bytes, instance.z);
  }

  public static Deserialize(bytes: Stream): Vector3 {
    return new Vector3(Int32Proxy.Deserialize(bytes), Int32Proxy.Deserialize(bytes), Int32Proxy.Deserialize(bytes));
  }
}
