import BundleCategoryType from './BundleCategoryType';
import LuckyDrawSetUnityView from './LuckyDrawSetUnityView';
import UberStrikeCurrencyType from './UberStrikeCurrencyType';

export default class LuckyDrawUnityView {
  public Id: int;
  public Name: string;
  public Description: string;
  public Price: int;
  public UberStrikeCurrencyType: UberStrikeCurrencyType;
  public IconUrl: string;
  public Category: BundleCategoryType;
  public IsAvailableInShop: bool;
  public LuckyDrawSets: List<LuckyDrawSetUnityView>;

  constructor(params: any = {}) {
    Object.keys(params).filter((key) => key in this).forEach((key) => { this[key] = params[key]; });
  }
}
