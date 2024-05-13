import { UberstrikeUserViewModel } from '@/UberStrike/Core/ViewModel';
import { Int32Proxy, MemberViewProxy, UberstrikeMemberViewProxy } from '.';

export default class UberstrikeUserViewModelProxy {
  public static Serialize(stream: Stream, instance: UberstrikeUserViewModel) {
    let num = 0;

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
  }

  public static Deserialize(bytes: Stream): UberstrikeUserViewModel {
    const num = Int32Proxy.Deserialize(bytes);
    const uberstrikeUserViewModel = new UberstrikeUserViewModel();

    if ((num & 1) !== 0) {
      uberstrikeUserViewModel.CmuneMemberView = MemberViewProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      uberstrikeUserViewModel.UberstrikeMemberView = UberstrikeMemberViewProxy.Deserialize(bytes);
    }

    return uberstrikeUserViewModel;
  }
}
