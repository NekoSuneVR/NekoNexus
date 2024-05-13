import { ContactRequestDeclineView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class ContactRequestDeclineViewProxy {
  public static Serialize(stream: Stream, instance: ContactRequestDeclineView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.ActionResult);
      Int32Proxy.Serialize(memoryStream, instance.RequestId);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
      return;
    }

    Int32Proxy.Serialize(stream, 0);
  }

  public static Deserialize(bytes: Stream): ContactRequestDeclineView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let contactRequestDeclineView: ContactRequestDeclineView | null = null;
    if (num !== 0) {
      contactRequestDeclineView = new ContactRequestDeclineView();
      contactRequestDeclineView.ActionResult = Int32Proxy.Deserialize(bytes);
      contactRequestDeclineView.RequestId = Int32Proxy.Deserialize(bytes);
    }
    return contactRequestDeclineView;
  }
}
