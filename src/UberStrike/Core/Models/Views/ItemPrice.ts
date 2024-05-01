import { BuyingDurationType, PackType, UberStrikeCurrencyType } from '@/Cmune/DataCenter/Common/Entities';

export default class ItemPrice {
  [key: string]: any;

  public Price: int;
  public Currency: UberStrikeCurrencyType;
  public Discount: int;
  public Amount: int;
  public PackType: PackType;
  public Duration: BuyingDurationType;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public get IsConsumable(): bool {
    return this.Amount > 0;
  }
}
