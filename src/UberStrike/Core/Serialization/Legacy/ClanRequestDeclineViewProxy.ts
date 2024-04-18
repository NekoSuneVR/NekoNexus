import { ClanRequestDeclineView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class ClanRequestDeclineViewProxy {
  public static Serialize(stream: Stream, instance: ClanRequestDeclineView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.ActionResult);
      Int32Proxy.Serialize(memoryStream, instance.ClanRequestId);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ClanRequestDeclineView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let clanRequestDeclineView: ClanRequestDeclineView | null = null;
    if (num !== 0) {
      clanRequestDeclineView = new ClanRequestDeclineView();
      clanRequestDeclineView.ActionResult = Int32Proxy.Deserialize(bytes);
      clanRequestDeclineView.ClanRequestId = Int32Proxy.Deserialize(bytes);
    }
    return clanRequestDeclineView;
  }
}
