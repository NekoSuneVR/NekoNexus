import { GroupPosition, MemberPositionUpdateView } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class MemberPositionUpdateViewProxy {
  public static Serialize(stream: Stream, instance: MemberPositionUpdateView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    if (instance.AuthToken) {
      StringProxy.Serialize(memoryStream, instance.AuthToken);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.GroupId);
    Int32Proxy.Serialize(memoryStream, instance.MemberCmid);
    EnumProxy.Serialize<GroupPosition>(memoryStream, instance.Position);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): MemberPositionUpdateView {
    const num = Int32Proxy.Deserialize(bytes);
    const memberPositionUpdateView = new MemberPositionUpdateView();

    if ((num & 1) !== 0) {
      memberPositionUpdateView.AuthToken = StringProxy.Deserialize(bytes);
    }

    memberPositionUpdateView.GroupId = Int32Proxy.Deserialize(bytes);
    memberPositionUpdateView.MemberCmid = Int32Proxy.Deserialize(bytes);
    memberPositionUpdateView.Position = EnumProxy.Deserialize<GroupPosition>(bytes);

    return memberPositionUpdateView;
  }
}
