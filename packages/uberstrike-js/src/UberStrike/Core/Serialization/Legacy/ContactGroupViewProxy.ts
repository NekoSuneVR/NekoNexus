import { ContactGroupView, PublicProfileView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import PublicProfileViewProxy from './PublicProfileViewProxy';

export default class ContactGroupViewProxy {
  public static Serialize(stream: Stream, instance: ContactGroupView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.Contacts) {
        ListProxy.Serialize<PublicProfileView>(memoryStream, instance.Contacts, PublicProfileViewProxy.Serialize);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.GroupId);
      if (instance.GroupName) {
        StringProxy.Serialize(memoryStream, instance.GroupName);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ContactGroupView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let contactGroupView: ContactGroupView | null = null;
    if (num !== 0) {
      contactGroupView = new ContactGroupView();
      if ((num & 1) !== 0) {
        contactGroupView.Contacts = ListProxy.Deserialize<PublicProfileView>(bytes, PublicProfileViewProxy.Deserialize);
      }
      contactGroupView.GroupId = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        contactGroupView.GroupName = StringProxy.Deserialize(bytes);
      }
    }
    return contactGroupView;
  }
}
