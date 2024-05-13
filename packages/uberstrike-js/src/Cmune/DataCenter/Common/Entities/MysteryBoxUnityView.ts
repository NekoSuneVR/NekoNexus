import BundleCategoryType from './BundleCategoryType';
import BundleItemView from './BundleItemView';
import UberStrikeCurrencyType from './UberStrikeCurrencyType';

export default class MysteryBoxUnityView {
  [key: string]: any;

  public Id: int;
  public Name: string;
  public Description: string;
  public Price: int;
  public UberStrikeCurrencyType: UberStrikeCurrencyType;
  public IconUrl: string;
  public Category: BundleCategoryType;
  public IsAvailableInShop: bool;
  public ItemsAttributed: int;
  public ImageUrl: string;
  public ExposeItemsToPlayers: bool;
  public PointsAttributed: int;
  public PointsAttributedWeight: int;
  public CreditsAttributed: int;
  public CreditsAttributedWeight: int;
  public MysteryBoxItems: List<BundleItemView>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
