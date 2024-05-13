import { GroupPosition, MemberPositionUpdateView } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class MemberPositionUpdateViewProxy {
  public static Serialize(stream: Stream, instance: MemberPositionUpdateView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.CmidMakingAction);
      Int32Proxy.Serialize(memoryStream, instance.GroupId);
      Int32Proxy.Serialize(memoryStream, instance.MemberCmid);
      EnumProxy.Serialize<GroupPosition>(memoryStream, instance.Position);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MemberPositionUpdateView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberPositionUpdateView: MemberPositionUpdateView | null = null;
    if (num !== 0) {
      memberPositionUpdateView = new MemberPositionUpdateView();
      memberPositionUpdateView.CmidMakingAction = Int32Proxy.Deserialize(bytes);
      memberPositionUpdateView.GroupId = Int32Proxy.Deserialize(bytes);
      memberPositionUpdateView.MemberCmid = Int32Proxy.Deserialize(bytes);
      memberPositionUpdateView.Position = EnumProxy.Deserialize<GroupPosition>(bytes);
    }
    return memberPositionUpdateView;
  }
}
