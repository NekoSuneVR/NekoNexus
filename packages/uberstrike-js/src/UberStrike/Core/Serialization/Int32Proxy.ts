export default class Int32Proxy {
  public static Serialize(bytes: Stream, instance: int): void {
    const bytes2 = Buffer.alloc(4);
    bytes2.writeInt32LE(Number(instance));

    bytes.push(...new Uint8Array(bytes2));
  }

  public static Deserialize(bytes: Stream): int {
    return Buffer.from(bytes.splice(0, 4)).readInt32LE();
  }
}
