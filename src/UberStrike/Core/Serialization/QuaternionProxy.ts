import SingleProxy from './SingleProxy';

export default class QuaternionProxy {
  public static Serialize(bytes: Stream, instance: Quaternion) {
    SingleProxy.Serialize(bytes, instance.x);
    SingleProxy.Serialize(bytes, instance.y);
    SingleProxy.Serialize(bytes, instance.z);
    SingleProxy.Serialize(bytes, instance.w);
  }

  public static Deserialize(bytes: Stream): Quaternion {
    return new Quaternion(SingleProxy.Deserialize(bytes), SingleProxy.Deserialize(bytes), SingleProxy.Deserialize(bytes), SingleProxy.Deserialize(bytes));
  }
}
