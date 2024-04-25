import { ItemTransactionView } from '@/Cmune/DataCenter/Common/Entities';

export default class ItemTransactionsViewModel {
  public ItemTransactions: List<ItemTransactionView>;
  public TotalCount: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
