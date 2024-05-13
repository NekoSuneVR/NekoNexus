import { ChannelType } from '@/Cmune/DataCenter/Common/Entities';
import { ServerConnectionView } from '@/UberStrike/Core/ViewModel';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class ServerConnectionViewProxy {
  public static Serialize(stream: Stream, instance: ServerConnectionView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, Number(instance.ApiVersion));
      EnumProxy.Serialize<ChannelType>(memoryStream, instance.Channel);
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ServerConnectionView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let serverConnectionView: ServerConnectionView | null = null;
    if (num !== 0) {
      serverConnectionView = new ServerConnectionView();
      serverConnectionView.ApiVersion = Int32Proxy.Deserialize(bytes).toString();
      serverConnectionView.Channel = EnumProxy.Deserialize<ChannelType>(bytes);
      serverConnectionView.Cmid = Int32Proxy.Deserialize(bytes);
    }
    return serverConnectionView;
  }
}
