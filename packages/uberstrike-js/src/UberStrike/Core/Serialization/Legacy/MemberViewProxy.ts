import { MemberView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import MemberWalletViewProxy from './MemberWalletViewProxy';
import PublicProfileViewProxy from './PublicProfileViewProxy';

export default class MemberViewProxy {
  public static Serialize(stream: Stream, instance: MemberView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.MemberItems) {
        ListProxy.Serialize<int>(memoryStream, instance.MemberItems, Int32Proxy.Serialize);
      } else {
        num |= 1;
      }
      if (instance.MemberWallet) {
        MemberWalletViewProxy.Serialize(memoryStream, instance.MemberWallet);
      } else {
        num |= 2;
      }
      if (instance.PublicProfile) {
        PublicProfileViewProxy.Serialize(memoryStream, instance.PublicProfile);
      } else {
        num |= 4;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MemberView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberView: MemberView | null = null;
    if (num !== 0) {
      memberView = new MemberView();
      if ((num & 1) !== 0) {
        memberView.MemberItems = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
      }
      if ((num & 2) !== 0) {
        memberView.MemberWallet = MemberWalletViewProxy.Deserialize(bytes)!;
      }
      if ((num & 4) !== 0) {
        memberView.PublicProfile = PublicProfileViewProxy.Deserialize(bytes)!;
      }
    }
    return memberView;
  }
}
