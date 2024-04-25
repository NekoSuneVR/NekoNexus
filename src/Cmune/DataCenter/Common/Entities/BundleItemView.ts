import BuyingDurationType from './BuyingDurationType';

export default class BundleItemView {
  public BundleId: int;
  public ItemId: int;
  public Amount: int;
  public Duration: BuyingDurationType;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
