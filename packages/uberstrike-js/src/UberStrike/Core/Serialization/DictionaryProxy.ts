import Int32Proxy from './Int32Proxy';

export default class DictionaryProxy {
  public static Serialize<S extends string | number, T>(
    bytes: Stream,
    instance: {},
    keySerialization: (bytes: Stream, instance: S) => void,
    valueSerialization: (bytes: Stream, instance: T) => void,
  ): void {
    Int32Proxy.Serialize(bytes, Object.keys(instance).length);

    for (const [key, value] of Object.entries(instance)) {
      keySerialization(bytes, key as S);
      valueSerialization(bytes, value as T);
    }
  }

  public static Deserialize<S extends string | number, T>(
    bytes: Stream,
    keySerialization: (bytes: Stream) => S,
    valueSerialization: (bytes: Stream) => T,
  ): Dictionary<S, T> {
    const num = Int32Proxy.Deserialize(bytes);
    const dictionary: { [key: string | number]: any } = {};

    for (let i = 0; i < num; i++) {
      dictionary[keySerialization(bytes) as string] = valueSerialization(bytes);
    }

    return dictionary;
  }
}
