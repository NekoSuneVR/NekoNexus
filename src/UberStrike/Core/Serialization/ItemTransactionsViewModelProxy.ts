import { ItemTransactionView } from '@/Cmune/DataCenter/Common/Entities';
import { ItemTransactionsViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from './Int32Proxy';
import ItemTransactionViewProxy from './ItemTransactionViewProxy';
import ListProxy from './ListProxy';

export default class ItemTransactionsViewModelProxy {
  public static Serialize(stream: Stream, instance: ItemTransactionsViewModel): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    if (instance.ItemTransactions) {
      ListProxy.Serialize<ItemTransactionView>(memoryStream, instance.ItemTransactions, ItemTransactionViewProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.TotalCount);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ItemTransactionsViewModel {
    const num = Int32Proxy.Deserialize(bytes);
    const itemTransactionsViewModel = new ItemTransactionsViewModel();

    if ((num & 1) !== 0) {
      itemTransactionsViewModel.ItemTransactions = ListProxy.Deserialize<ItemTransactionView>(bytes, ItemTransactionViewProxy.Deserialize);
    }

    itemTransactionsViewModel.TotalCount = Int32Proxy.Deserialize(bytes);

    return itemTransactionsViewModel;
  }
}
