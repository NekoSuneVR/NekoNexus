import { BuyingDurationType, PackType, UberStrikeCurrencyType } from '@/Cmune/DataCenter/Common/Entities';

export default class ItemPrice {
  Price: number;
  Currency: UberStrikeCurrencyType;
  Discount: number;
  Amount: number;
  PackType: PackType;
  Duration: BuyingDurationType;

  constructor(params: Partial<ItemPrice> = {}) {
    Object.assign(this, params);
  }

  get IsConsumable(): boolean {
    return this.Amount > 0;
  }
}
