export default class PackageView {
  [key: string]: any;

  public Bonus: int;
  public Price: decimal;
  public Items: List<int>;
  public Name: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
