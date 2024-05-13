import { ClanInvitationAnswerViewModel } from '@/UberStrike/Core/ViewModel';
import BooleanProxy from '../BooleanProxy';
import Int32Proxy from '../Int32Proxy';

export default class ClanInvitationAnswerViewModelProxy {
  public static Serialize(stream: Stream, instance: ClanInvitationAnswerViewModel): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.GroupInvitationId);
      BooleanProxy.Serialize(memoryStream, instance.IsInvitationAccepted);
      Int32Proxy.Serialize(memoryStream, instance.ReturnValue);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): ClanInvitationAnswerViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let clanInvitationAnswerViewModel: ClanInvitationAnswerViewModel | null = null;
    if (num !== 0) {
      clanInvitationAnswerViewModel = new ClanInvitationAnswerViewModel();
      clanInvitationAnswerViewModel.GroupInvitationId = Int32Proxy.Deserialize(bytes);
      clanInvitationAnswerViewModel.IsInvitationAccepted = BooleanProxy.Deserialize(bytes);
      clanInvitationAnswerViewModel.ReturnValue = Int32Proxy.Deserialize(bytes);
    }
    return clanInvitationAnswerViewModel;
  }
}
