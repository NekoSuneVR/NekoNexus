import UShortProxy from './UShortProxy';

export default class StringProxy {
  public static Serialize(bytes: Stream, instance: string): void {
    if (!instance?.length) {
      UShortProxy.Serialize(bytes, 0);
    } else {
      UShortProxy.Serialize(bytes, String(instance).length);
      const bytes2 = Buffer.from(String(instance), 'utf16le');
      bytes.push(...bytes2);
    }
  }

  public static Deserialize(bytes: Stream): string {
    const num = UShortProxy.Deserialize(bytes);

    if (num > 0) {
      return Buffer.from(bytes.splice(0, (num * 2))).toString('utf16le');
    }

    return '';
  }
}
