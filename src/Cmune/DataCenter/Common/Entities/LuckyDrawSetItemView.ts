import BuyingDurationType from './BuyingDurationType';

export default class LuckyDrawSetItemView {
  [key: string]: any;

  public Id: int;
  public Name: string;
  public ItemId: int;
  public DurationType: BuyingDurationType;
  public Amount: int;
  public LuckyDrawSetId: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
