import BundleCategoryType from './BundleCategoryType';
import LuckyDrawSetView from './LuckyDrawSetView';
import UberStrikeCurrencyType from './UberStrikeCurrencyType';

export default class LuckyDrawView {
  public Id: int;
  public Name: string;
  public Description: string;
  public Price: int;
  public UberStrikeCurrencyType: UberStrikeCurrencyType;
  public IconUrl: string;
  public Category: BundleCategoryType;
  public IsAvailableInShop: bool;
  public LuckyDrawSets: List<LuckyDrawSetView>;
  public IsEnabled: bool;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
