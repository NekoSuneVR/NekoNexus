import { PrivateMessageView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import DateTimeProxy from '../DateTimeProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class PrivateMessageViewProxy {
  public static Serialize(stream: Stream, instance: PrivateMessageView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.ContentText) {
        StringProxy.Serialize(memoryStream, instance.ContentText);
      } else {
        num |= 1;
      }
      DateTimeProxy.Serialize(memoryStream, instance.DateSent);
      Int32Proxy.Serialize(memoryStream, instance.FromCmid);
      if (instance.FromName) {
        StringProxy.Serialize(memoryStream, instance.FromName);
      } else {
        num |= 2;
      }
      BooleanProxy.Serialize(memoryStream, instance.HasAttachment);
      BooleanProxy.Serialize(memoryStream, instance.IsDeletedByReceiver);
      BooleanProxy.Serialize(memoryStream, instance.IsDeletedBySender);
      BooleanProxy.Serialize(memoryStream, instance.IsRead);
      Int32Proxy.Serialize(memoryStream, instance.PrivateMessageId);
      Int32Proxy.Serialize(memoryStream, instance.ToCmid);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): PrivateMessageView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let privateMessageView: PrivateMessageView | null = null;
    if (num !== 0) {
      privateMessageView = new PrivateMessageView();
      if ((num & 1) !== 0) {
        privateMessageView.ContentText = StringProxy.Deserialize(bytes);
      }
      privateMessageView.DateSent = DateTimeProxy.Deserialize(bytes);
      privateMessageView.FromCmid = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        privateMessageView.FromName = StringProxy.Deserialize(bytes);
      }
      privateMessageView.HasAttachment = BooleanProxy.Deserialize(bytes);
      privateMessageView.IsDeletedByReceiver = BooleanProxy.Deserialize(bytes);
      privateMessageView.IsDeletedBySender = BooleanProxy.Deserialize(bytes);
      privateMessageView.IsRead = BooleanProxy.Deserialize(bytes);
      privateMessageView.PrivateMessageId = Int32Proxy.Deserialize(bytes);
      privateMessageView.ToCmid = Int32Proxy.Deserialize(bytes);
    }
    return privateMessageView;
  }
}
