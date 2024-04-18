import { ClanMemberView, GroupPosition } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class ClanMemberViewProxy {
  public static Serialize(stream: Stream, instance: ClanMemberView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      DateTimeProxy.Serialize(memoryStream, instance.JoiningDate);
      DateTimeProxy.Serialize(memoryStream, instance.Lastlogin);
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 1;
      }
      EnumProxy.Serialize<GroupPosition>(memoryStream, instance.Position);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ClanMemberView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let clanMemberView: ClanMemberView | null = null;
    if (num !== 0) {
      clanMemberView = new ClanMemberView();
      clanMemberView.Cmid = Int32Proxy.Deserialize(bytes);
      clanMemberView.JoiningDate = DateTimeProxy.Deserialize(bytes);
      clanMemberView.Lastlogin = DateTimeProxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        clanMemberView.Name = StringProxy.Deserialize(bytes);
      }
      clanMemberView.Position = EnumProxy.Deserialize<GroupPosition>(bytes);
    }
    return clanMemberView;
  }
}
