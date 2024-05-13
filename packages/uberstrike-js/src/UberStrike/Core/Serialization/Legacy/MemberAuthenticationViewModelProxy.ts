import { MemberAuthenticationResult } from '@/Cmune/DataCenter/Common/Entities';
import { MemberAuthenticationViewModel } from '@/UberStrike/Core/ViewModel';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import MemberViewProxy from './MemberViewProxy';

export default class MemberAuthenticationViewModelProxy {
  public static Serialize(stream: Stream, instance: MemberAuthenticationViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      EnumProxy.Serialize<MemberAuthenticationResult>(memoryStream, instance.MemberAuthenticationResult);
      if (instance.MemberView) {
        MemberViewProxy.Serialize(memoryStream, instance.MemberView);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MemberAuthenticationViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberAuthenticationViewModel: MemberAuthenticationViewModel | null = null;
    if (num !== 0) {
      memberAuthenticationViewModel = new MemberAuthenticationViewModel();
      memberAuthenticationViewModel.MemberAuthenticationResult =
        EnumProxy.Deserialize<MemberAuthenticationResult>(bytes);
      if ((num & 1) !== 0) {
        memberAuthenticationViewModel.MemberView = MemberViewProxy.Deserialize(bytes)!;
      }
    }
    return memberAuthenticationViewModel;
  }
}
