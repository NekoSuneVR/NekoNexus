import { CheckApplicationVersionView } from '@/Cmune/DataCenter/Common/Entities';
import ApplicationViewProxy from './ApplicationViewProxy';
import Int32Proxy from './Int32Proxy';

export default class CheckApplicationVersionViewProxy {
  public static Serialize(stream: Stream, instance: CheckApplicationVersionView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];

    if (instance.ClientVersion) {
      ApplicationViewProxy.Serialize(memoryStream, instance.ClientVersion);
    } else {
      num |= 1;
    }

    if (instance.CurrentVersion) {
      ApplicationViewProxy.Serialize(memoryStream, instance.CurrentVersion);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): CheckApplicationVersionView {
    const num = Int32Proxy.Deserialize(bytes);
    const checkApplicationVersionView = new CheckApplicationVersionView();

    if ((num & 1) !== 0) {
      checkApplicationVersionView.ClientVersion = ApplicationViewProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      checkApplicationVersionView.CurrentVersion = ApplicationViewProxy.Deserialize(bytes);
    }

    return checkApplicationVersionView;
  }
}
