import { BugView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class BugViewProxy {
  public static Serialize(stream: Stream, instance: BugView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.Content) {
        StringProxy.Serialize(memoryStream, instance.Content);
      } else {
        num |= 1;
      }
      if (instance.Subject) {
        StringProxy.Serialize(memoryStream, instance.Subject);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): BugView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let bugView: BugView | null = null;
    if (num !== 0) {
      bugView = new BugView();
      if ((num & 1) !== 0) {
        bugView.Content = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        bugView.Subject = StringProxy.Deserialize(bytes);
      }
    }
    return bugView;
  }
}
