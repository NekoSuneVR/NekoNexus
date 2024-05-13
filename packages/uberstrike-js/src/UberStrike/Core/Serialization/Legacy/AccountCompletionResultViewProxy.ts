import { AccountCompletionResultView } from '@/UberStrike/DataCenter/Common/Entities';
import DictionaryProxy from '../DictionaryProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';

export default class AccountCompletionResultViewProxy {
  public static Serialize(stream: Stream, instance: AccountCompletionResultView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.ItemsAttributed) {
        DictionaryProxy.Serialize<int, int>(
          memoryStream,
          instance.ItemsAttributed,
          Int32Proxy.Serialize,
          Int32Proxy.Serialize,
        );
      } else {
        num |= 1;
      }
      if (instance.NonDuplicateNames) {
        ListProxy.Serialize<string>(memoryStream, instance.NonDuplicateNames, StringProxy.Serialize);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.Result);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): AccountCompletionResultView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let accountCompletionResultView: AccountCompletionResultView | null = null;
    if (num !== 0) {
      accountCompletionResultView = new AccountCompletionResultView();
      if ((num & 1) !== 0) {
        accountCompletionResultView.ItemsAttributed = DictionaryProxy.Deserialize<int, int>(
          bytes,
          Int32Proxy.Deserialize,
          Int32Proxy.Deserialize,
        );
      }
      if ((num & 2) !== 0) {
        accountCompletionResultView.NonDuplicateNames = ListProxy.Deserialize<string>(bytes, StringProxy.Deserialize);
      }
      accountCompletionResultView.Result = Int32Proxy.Deserialize(bytes);
    }
    return accountCompletionResultView;
  }
}
