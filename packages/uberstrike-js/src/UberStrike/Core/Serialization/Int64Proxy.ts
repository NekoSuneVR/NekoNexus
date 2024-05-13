export default class Int64Proxy {
  public static Serialize(bytes: Stream, instance: long): void {
    const bytes2 = Buffer.alloc(8);
    bytes2.writeBigInt64LE(BigInt(instance ?? 0));

    bytes.push(...new Uint8Array(bytes2));
  }

  public static Deserialize(bytes: Stream): long {
    const array = Uint8Array.from(bytes.splice(0, 8));

    return Buffer.from(array).readBigInt64LE();
  }
}
