import { ClanCreationReturnView } from '@/Cmune/DataCenter/Common/Entities';
import ClanViewProxy from './ClanViewProxy';
import Int32Proxy from './Int32Proxy';

export default class ClanCreationReturnViewProxy {
  public static Serialize(stream: Stream, instance: ClanCreationReturnView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
    if (instance.ClanView) {
      ClanViewProxy.Serialize(memoryStream, instance.ClanView);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.ResultCode);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ClanCreationReturnView {
    const num = Int32Proxy.Deserialize(bytes);
    const clanCreationReturnView = new ClanCreationReturnView();

    if ((num & 1) !== 0) {
      clanCreationReturnView.ClanView = ClanViewProxy.Deserialize(bytes);
    }

    clanCreationReturnView.ResultCode = Int32Proxy.Deserialize(bytes);

    return clanCreationReturnView;
  }
}
