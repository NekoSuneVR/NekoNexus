export default class UInt16Proxy {
  public static Serialize(bytes: Stream, instance: ushort): void {
    const bytes2 = Buffer.alloc(2);
    bytes2.writeUInt16LE(Number(instance));

    bytes.push(...new Uint8Array(bytes2));
  }

  public static Deserialize(bytes: Stream): ushort {
    return Buffer.from(bytes.splice(0, 2)).readUInt16LE();
  }
}
