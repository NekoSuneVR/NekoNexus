import UShortProxy from './UShortProxy';

export default class ListProxy {
  public static Serialize<T>(
    bytes: Stream,
    instance: List<T>,
    serialization: (bytes: Stream, instance: T) => void,
  ): void {
    UShortProxy.Serialize(bytes, instance.length);

    for (const t of instance) {
      serialization(bytes, t);
    }
  }

  public static Deserialize<T>(bytes: Stream, serialization: (bytes: Stream) => T | null): List<T> {
    const num = UShortProxy.Deserialize(bytes);
    const list: List<T> = [];

    for (let i = 0; i < num; i++) {
      const item = serialization(bytes);
      if (item) list.push(item);
    }

    return list;
  }
}
