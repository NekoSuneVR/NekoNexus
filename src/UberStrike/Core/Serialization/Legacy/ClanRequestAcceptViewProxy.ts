import { ClanRequestAcceptView } from '@/Cmune/DataCenter/Common/Entities';
import ClanViewProxy from '../ClanViewProxy';
import Int32Proxy from '../Int32Proxy';

export default class ClanRequestAcceptViewProxy {
  public static Serialize(stream: Stream, instance: ClanRequestAcceptView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.ActionResult);
      Int32Proxy.Serialize(memoryStream, instance.ClanRequestId);
      if (instance.ClanView) {
        ClanViewProxy.Serialize(memoryStream, instance.ClanView);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ClanRequestAcceptView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let clanRequestAcceptView: ClanRequestAcceptView | null = null;
    if (num !== 0) {
      clanRequestAcceptView = new ClanRequestAcceptView();
      clanRequestAcceptView.ActionResult = Int32Proxy.Deserialize(bytes);
      clanRequestAcceptView.ClanRequestId = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        clanRequestAcceptView.ClanView = ClanViewProxy.Deserialize(bytes);
      }
    }
    return clanRequestAcceptView;
  }
}
