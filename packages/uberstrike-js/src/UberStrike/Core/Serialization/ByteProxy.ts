export default class ByteProxy {
  public static Serialize(bytes: Stream, instance: byte): void {
    const bytes2 = Uint8Array.from([Number(instance)]);
    bytes.push(bytes2[0]);
  }

  public static Deserialize(bytes: Stream): byte {
    return bytes.splice(0, 1)[0];
  }
}
