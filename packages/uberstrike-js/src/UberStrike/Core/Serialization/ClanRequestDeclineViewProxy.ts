import { ClanRequestDeclineView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from './Int32Proxy';

export default class ClanRequestDeclineViewProxy {
  public static Serialize(stream: Stream, instance: ClanRequestDeclineView): void {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.ActionResult);
    Int32Proxy.Serialize(memoryStream, instance.ClanRequestId);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ClanRequestDeclineView {
    return new ClanRequestDeclineView({
      ActionResult: Int32Proxy.Deserialize(bytes),
      ClanRequestId: Int32Proxy.Deserialize(bytes),
    });
  }
}
