import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import { ServerConnectionView } from '@/UberStrike/Core/ViewModel';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class ServerConnectionViewProxy {
  public static Serialize(stream: Stream, instance: ServerConnectionView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    EnumProxy.Serialize<MemberAccessLevel>(memoryStream, instance.AccessLevel);

    if (instance.ApiVersion) {
      StringProxy.Serialize(memoryStream, instance.ApiVersion);
    } else {
      num |= 1;
    }

    EnumProxy.Serialize<ChannelType>(memoryStream, instance.Channel);
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ServerConnectionView {
    const num = Int32Proxy.Deserialize(bytes);
    const serverConnectionView = new ServerConnectionView();
    serverConnectionView.AccessLevel = EnumProxy.Deserialize<MemberAccessLevel>(bytes);

    if ((num & 1) !== 0) {
      serverConnectionView.ApiVersion = StringProxy.Deserialize(bytes);
    }

    serverConnectionView.Channel = EnumProxy.Deserialize<ChannelType>(bytes);
    serverConnectionView.Cmid = Int32Proxy.Deserialize(bytes);

    return serverConnectionView;
  }
}
