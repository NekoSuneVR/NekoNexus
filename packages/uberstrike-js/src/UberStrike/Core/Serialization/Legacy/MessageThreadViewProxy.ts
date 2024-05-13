import { MessageThreadView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import DateTimeProxy from '../DateTimeProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class MessageThreadViewProxy {
  public static Serialize(stream: Stream, instance: MessageThreadView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      BooleanProxy.Serialize(memoryStream, instance.HasNewMessages);
      if (instance.LastMessagePreview) {
        StringProxy.Serialize(memoryStream, instance.LastMessagePreview);
      } else {
        num |= 1;
      }
      DateTimeProxy.Serialize(memoryStream, instance.LastUpdate);
      Int32Proxy.Serialize(memoryStream, instance.MessageCount);
      Int32Proxy.Serialize(memoryStream, instance.ThreadId);
      if (instance.ThreadName) {
        StringProxy.Serialize(memoryStream, instance.ThreadName);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MessageThreadView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let messageThreadView: MessageThreadView | null = null;
    if (num !== 0) {
      messageThreadView = new MessageThreadView();
      messageThreadView.HasNewMessages = BooleanProxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        messageThreadView.LastMessagePreview = StringProxy.Deserialize(bytes);
      }
      messageThreadView.LastUpdate = DateTimeProxy.Deserialize(bytes);
      messageThreadView.MessageCount = Int32Proxy.Deserialize(bytes);
      messageThreadView.ThreadId = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        messageThreadView.ThreadName = StringProxy.Deserialize(bytes);
      }
    }
    return messageThreadView;
  }
}
