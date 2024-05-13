import { ConnectionAddress } from '@/UberStrike/Core/Models';
import Int32Proxy from './Int32Proxy';
import UInt16Proxy from './UInt16Proxy';

export default class ConnectionAddressProxy {
  public static Serialize(stream: Stream, instance: ConnectionAddress): void {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.Ipv4);
    UInt16Proxy.Serialize(memoryStream, instance.Port);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: any): ConnectionAddress {
    const connectionAddress = new ConnectionAddress('');
    connectionAddress.Ipv4 = Int32Proxy.Deserialize(bytes);
    connectionAddress.Port = UInt16Proxy.Deserialize(bytes);

    return connectionAddress;
  }
}
