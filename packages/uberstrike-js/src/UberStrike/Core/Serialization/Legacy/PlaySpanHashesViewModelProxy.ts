import { PlaySpanHashesViewModel } from '@/UberStrike/Core/ViewModel';
import DecimalProxy from '../DecimalProxy';
import DictionaryProxy from '../DictionaryProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class PlaySpanHashesViewModelProxy {
  public static Serialize(stream: Stream, instance: PlaySpanHashesViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.Hashes) {
        DictionaryProxy.Serialize<decimal, string>(
          memoryStream,
          instance.Hashes,
          DecimalProxy.Serialize,
          StringProxy.Serialize,
        );
      } else {
        num |= 1;
      }
      if (instance.MerchTrans) {
        StringProxy.Serialize(memoryStream, instance.MerchTrans);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): PlaySpanHashesViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let playSpanHashesViewModel: PlaySpanHashesViewModel | null = null;
    if (num !== 0) {
      playSpanHashesViewModel = new PlaySpanHashesViewModel();
      if ((num & 1) !== 0) {
        playSpanHashesViewModel.Hashes = DictionaryProxy.Deserialize<decimal, string>(
          bytes,
          DecimalProxy.Deserialize,
          StringProxy.Deserialize,
        );
      }
      if ((num & 2) !== 0) {
        playSpanHashesViewModel.MerchTrans = StringProxy.Deserialize(bytes);
      }
    }
    return playSpanHashesViewModel;
  }
}
