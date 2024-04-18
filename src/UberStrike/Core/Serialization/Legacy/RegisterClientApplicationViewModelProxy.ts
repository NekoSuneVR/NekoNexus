import { ApplicationRegistrationResult } from '@/Cmune/DataCenter/Common/Entities';
import { RegisterClientApplicationViewModel } from '@/UberStrike/Core/ViewModel';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';

export default class RegisterClientApplicationViewModelProxy {
  public static Serialize(stream: Stream, instance: RegisterClientApplicationViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.ItemsAttributed) {
        ListProxy.Serialize<int>(memoryStream, instance.ItemsAttributed, Int32Proxy.Serialize);
      } else {
        num |= 1;
      }
      EnumProxy.Serialize<ApplicationRegistrationResult>(memoryStream, instance.Result);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): RegisterClientApplicationViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let registerClientApplicationViewModel: RegisterClientApplicationViewModel | null = null;
    if (num !== 0) {
      registerClientApplicationViewModel = new RegisterClientApplicationViewModel();
      if ((num & 1) !== 0) {
        registerClientApplicationViewModel.ItemsAttributed = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
      }
      registerClientApplicationViewModel.Result = EnumProxy.Deserialize<ApplicationRegistrationResult>(bytes);
    }
    return registerClientApplicationViewModel;
  }
}
