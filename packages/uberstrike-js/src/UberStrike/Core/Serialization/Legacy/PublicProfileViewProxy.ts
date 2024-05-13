import { EmailAddressStatus, MemberAccessLevel, PublicProfileView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class PublicProfileViewProxy {
  public static Serialize(stream: Stream, instance: PublicProfileView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      EnumProxy.Serialize<MemberAccessLevel>(memoryStream, instance.AccessLevel);
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      EnumProxy.Serialize<EmailAddressStatus>(memoryStream, instance.EmailAddressStatus);
      if (instance.GroupTag) {
        StringProxy.Serialize(memoryStream, instance.GroupTag);
      } else {
        num |= 1;
      }
      BooleanProxy.Serialize(memoryStream, instance.IsChatDisabled);
      DateTimeProxy.Serialize(memoryStream, instance.LastLoginDate);
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): PublicProfileView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let publicProfileView: PublicProfileView | null = null;
    if (num !== 0) {
      publicProfileView = new PublicProfileView();
      publicProfileView.AccessLevel = EnumProxy.Deserialize<MemberAccessLevel>(bytes);
      publicProfileView.Cmid = Int32Proxy.Deserialize(bytes);
      publicProfileView.EmailAddressStatus = EnumProxy.Deserialize<EmailAddressStatus>(bytes);
      if ((num & 1) !== 0) {
        publicProfileView.GroupTag = StringProxy.Deserialize(bytes);
      }
      publicProfileView.IsChatDisabled = BooleanProxy.Deserialize(bytes);
      publicProfileView.LastLoginDate = DateTimeProxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        publicProfileView.Name = StringProxy.Deserialize(bytes);
      }
    }
    return publicProfileView;
  }
}
