import LuckyDrawSetItemView from './LuckyDrawSetItemView';

export default class LuckyDrawSetView {
  public Id: int;
  public SetWeight: int;
  public CreditsAttributed: int;
  public PointsAttributed: int;
  public ImageUrl: string;
  public ExposeItemsToPlayers: bool;
  public LuckyDrawId: int;
  public LuckyDrawSetItems: List<LuckyDrawSetItemView>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
