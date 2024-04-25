export default class PlaySpanHashesViewModel {
  public MerchTrans: string;
  public Hashes: Dictionary<decimal, string>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
