import { ContactRequestAcceptView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import PublicProfileViewProxy from './PublicProfileViewProxy';

export default class ContactRequestAcceptViewProxy {
  public static Serialize(stream: Stream, instance: ContactRequestAcceptView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.ActionResult);
      if (instance.Contact) {
        PublicProfileViewProxy.Serialize(memoryStream, instance.Contact);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.RequestId);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
      return;
    }
    Int32Proxy.Serialize(stream, 0);
  }

  public static Deserialize(bytes: Stream): ContactRequestAcceptView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let contactRequestAcceptView: ContactRequestAcceptView | null = null;
    if (num !== 0) {
      contactRequestAcceptView = new ContactRequestAcceptView();
      contactRequestAcceptView.ActionResult = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        contactRequestAcceptView.Contact = PublicProfileViewProxy.Deserialize(bytes);
      }
      contactRequestAcceptView.RequestId = Int32Proxy.Deserialize(bytes);
    }
    return contactRequestAcceptView;
  }
}
