import BundleCategoryType from './BundleCategoryType';
import BundleItemView from './BundleItemView';
import ChannelType from './ChannelType';

export default class BundleView {
  [key: string]: any;

  public Id: int;
  public ApplicationId: int;
  public Name: string;
  public ImageUrl: string;
  public IconUrl: string;
  public Description: string;
  public IsOnSale: bool;
  public IsPromoted: bool;
  public USDPrice: decimal;
  public USDPromoPrice: decimal;
  public Credits: int;
  public Points: int;
  public BundleItemViews: List<BundleItemView>;
  public Category: BundleCategoryType;
  public Availability: List<ChannelType>;
  public PromotionTag: string;
  public MacAppStoreUniqueId: string;
  public IosAppStoreUniqueId: string;
  public AndroidStoreUniqueId: string;
  public IsDefault: bool;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
