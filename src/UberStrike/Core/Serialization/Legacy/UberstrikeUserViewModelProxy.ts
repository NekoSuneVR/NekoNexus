import { UberstrikeUserViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from '../Int32Proxy';
import MemberViewProxy from './MemberViewProxy';
import UberstrikeMemberViewProxy from './UberstrikeMemberViewProxy';

export default class UberstrikeUserViewModelProxy {
  public static Serialize(stream: Stream, instance: UberstrikeUserViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.CmuneMemberView) {
        MemberViewProxy.Serialize(memoryStream, instance.CmuneMemberView);
      } else {
        num |= 1;
      }
      if (instance.UberstrikeMemberView) {
        UberstrikeMemberViewProxy.Serialize(memoryStream, instance.UberstrikeMemberView);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): UberstrikeUserViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberstrikeUserViewModel: UberstrikeUserViewModel | null = null;
    if (num !== 0) {
      uberstrikeUserViewModel = new UberstrikeUserViewModel();
      if ((num & 1) !== 0) {
        uberstrikeUserViewModel.CmuneMemberView = (MemberViewProxy.Deserialize(bytes))!;
      }
      if ((num & 2) !== 0) {
        uberstrikeUserViewModel.UberstrikeMemberView = (UberstrikeMemberViewProxy.Deserialize(bytes))!;
      }
    }
    return uberstrikeUserViewModel;
  }
}
