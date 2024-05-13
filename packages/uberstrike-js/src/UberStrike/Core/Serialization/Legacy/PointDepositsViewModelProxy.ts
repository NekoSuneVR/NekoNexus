import { PointDepositView } from '@/Cmune/DataCenter/Common/Entities';
import { PointDepositsViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import PointDepositViewProxy from './PointDepositViewProxy';

export default class PointDepositsViewModelProxy {
  public static Serialize(stream: Stream, instance: PointDepositsViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.PointDeposits) {
        ListProxy.Serialize<PointDepositView>(memoryStream, instance.PointDeposits, PointDepositViewProxy.Serialize);
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

  public static Deserialize(bytes: Stream): PointDepositsViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let pointDepositsViewModel: PointDepositsViewModel | null = null;
    if (num !== 0) {
      pointDepositsViewModel = new PointDepositsViewModel();
      if ((num & 1) !== 0) {
        pointDepositsViewModel.PointDeposits = ListProxy.Deserialize<PointDepositView>(
          bytes,
          PointDepositViewProxy.Deserialize,
        );
      }
      pointDepositsViewModel.TotalCount = Int32Proxy.Deserialize(bytes);
    }
    return pointDepositsViewModel;
  }
}
