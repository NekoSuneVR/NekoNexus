import { ItemTransactionView } from '@/Cmune/DataCenter/Common/Entities';
import { ItemTransactionsViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import ItemTransactionViewProxy from './ItemTransactionViewProxy';

export default class ItemTransactionsViewModelProxy {
  public static Serialize(stream: Stream, instance: ItemTransactionsViewModel): void {
    let num = 0;
    if (instance != null) {
      const memoryStream: MemoryStream = [];
      if (instance.ItemTransactions != null) {
        ListProxy.Serialize<ItemTransactionView>(
          memoryStream,
          instance.ItemTransactions,
          ItemTransactionViewProxy.Serialize,
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

  public static Deserialize(bytes: Stream): ItemTransactionsViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let itemTransactionsViewModel: ItemTransactionsViewModel | null = null;
    if (num !== 0) {
      itemTransactionsViewModel = new ItemTransactionsViewModel();
      if ((num & 1) !== 0) {
        itemTransactionsViewModel.ItemTransactions = ListProxy.Deserialize<ItemTransactionView>(
          bytes,
          ItemTransactionViewProxy.Deserialize,
        );
      }
      itemTransactionsViewModel.TotalCount = Int32Proxy.Deserialize(bytes);
    }
    return itemTransactionsViewModel;
  }
}
