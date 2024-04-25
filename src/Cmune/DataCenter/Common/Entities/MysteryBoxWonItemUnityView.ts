export default class MysteryBoxWonItemUnityView {
  public ItemIdWon: int;
  public CreditWon: int;
  public PointWon: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
