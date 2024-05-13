import Int32Proxy from './Int32Proxy';

export default class DecimalProxy {
  public static Serialize(bytes: Stream, instance: decimal): void {
    // JavaScript does not support the max value of decimal, so we fake it using simple integers
    Int32Proxy.Serialize(bytes, Number(instance));
    Int32Proxy.Serialize(bytes, 0);
    Int32Proxy.Serialize(bytes, 0);
    Int32Proxy.Serialize(bytes, 0);
  }

  public static Deserialize(bytes: Stream): decimal {
    const array = [
      Int32Proxy.Deserialize(bytes),
      Int32Proxy.Deserialize(bytes),
      Int32Proxy.Deserialize(bytes),
      Int32Proxy.Deserialize(bytes),
    ];

    return array[0];
  }
}
