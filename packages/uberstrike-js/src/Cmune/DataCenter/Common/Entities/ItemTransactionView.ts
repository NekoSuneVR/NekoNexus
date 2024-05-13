import BuyingDurationType from './BuyingDurationType';

export default class ItemTransactionView {
  [key: string]: any;

  public WithdrawalId: int;
  public WithdrawalDate: DateTime;
  public Points: int;
  public Credits: int;
  public Cmid: int;
  public IsAdminAction: bool;
  public ItemId: int;
  public Duration: BuyingDurationType;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
