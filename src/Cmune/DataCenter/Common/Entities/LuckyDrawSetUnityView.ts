import BundleItemView from './BundleItemView';

export default class LuckyDrawSetUnityView {
  [key: string]: any;

  public Id: int;
  public SetWeight: int;
  public CreditsAttributed: int;
  public PointsAttributed: int;
  public ImageUrl: string;
  public ExposeItemsToPlayers: bool;
  public LuckyDrawId: int;
  public LuckyDrawSetItems: List<BundleItemView>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
