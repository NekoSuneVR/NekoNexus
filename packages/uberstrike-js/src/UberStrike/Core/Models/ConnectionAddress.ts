export default class ConnectionAddress {
  public Ipv4: int;
  public Port: ushort;

  public get ConnectionString(): string {
    return `${ConnectionAddress.ToString(this.Ipv4)}:${this.Port}`;
  }

  public get IpAddress(): string {
    return ConnectionAddress.ToString(this.Ipv4);
  }

  constructor();
  constructor(connection?: string);
  constructor(ipAddress?: string, port?: ushort) {
    if (port === undefined) {
      try {
        const array = ipAddress!.split(':');
        this.Ipv4 = ConnectionAddress.ToInteger(array[0]);
        this.Port = Number(array[1]);
      } catch (error) {}
    } else {
      this.Ipv4 = ConnectionAddress.ToInteger(ipAddress!);
      this.Port = port;
    }
  }

  public static ToString(ipv4: int): string {
    return `${(ipv4 >> 24) & 255}.${(ipv4 >> 16) & 255}.${(ipv4 >> 8) & 255}.${ipv4 & 255}`;
  }

  public static ToInteger(ipAddress: string): int {
    let num = 0;
    const array = ipAddress.split('.');

    if (array.length === 4) {
      for (let i = 0; i < array.length; i++) {
        num |= Number(array[i]) << ((3 - i) * 8);
      }
    }

    return num;
  }
}
