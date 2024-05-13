export default class SingleProxy {
  public static Serialize(bytes: Stream, instance: float): void {
    const bytes2 = Buffer.alloc(4);
    bytes2.writeFloatLE(Number(instance));

    bytes.push(...new Uint8Array(bytes2));
  }

  public static Deserialize(bytes: Stream): float {
    return Number(Buffer.from(bytes.splice(0, 4)).readFloatLE().toFixed(2));
  }
}
