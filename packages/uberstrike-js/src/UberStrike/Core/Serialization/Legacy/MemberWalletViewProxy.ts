import { MemberWalletView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import Int32Proxy from '../Int32Proxy';

export default class MemberWalletViewProxy {
  public static Serialize(stream: Stream, instance: MemberWalletView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      Int32Proxy.Serialize(memoryStream, instance.Credits);
      DateTimeProxy.Serialize(memoryStream, instance.CreditsExpiration);
      Int32Proxy.Serialize(memoryStream, instance.Points);
      DateTimeProxy.Serialize(memoryStream, instance.PointsExpiration);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MemberWalletView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberWalletView: MemberWalletView | null = null;
    if (num !== 0) {
      memberWalletView = new MemberWalletView();
      memberWalletView.Cmid = Int32Proxy.Deserialize(bytes);
      memberWalletView.Credits = Int32Proxy.Deserialize(bytes);
      memberWalletView.CreditsExpiration = DateTimeProxy.Deserialize(bytes);
      memberWalletView.Points = Int32Proxy.Deserialize(bytes);
      memberWalletView.PointsExpiration = DateTimeProxy.Deserialize(bytes);
    }
    return memberWalletView;
  }
}
