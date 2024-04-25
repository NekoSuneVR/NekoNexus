import { CurrencyDepositView } from '@/Cmune/DataCenter/Common/Entities';
import { CurrencyDepositsViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import CurrencyDepositViewProxy from './CurrencyDepositViewProxy';

export default class CurrencyDepositsViewModelProxy {
  public static Serialize(stream: Stream, instance: CurrencyDepositsViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.CurrencyDeposits) {
        ListProxy.Serialize<CurrencyDepositView>(
          memoryStream,
          instance.CurrencyDeposits,
          CurrencyDepositViewProxy.Serialize,
        );
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.TotalCount);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): CurrencyDepositsViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let currencyDepositsViewModel: CurrencyDepositsViewModel | null = null;
    if (num !== 0) {
      currencyDepositsViewModel = new CurrencyDepositsViewModel();
      if ((num & 1) !== 0) {
        currencyDepositsViewModel.CurrencyDeposits = ListProxy.Deserialize<CurrencyDepositView>(
          bytes,
          CurrencyDepositViewProxy.Deserialize,
        );
      }
      currencyDepositsViewModel.TotalCount = Int32Proxy.Deserialize(bytes);
    }
    return currencyDepositsViewModel;
  }
}
