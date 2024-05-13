export default class DailyPointsView {
  [key: string]: any;

  public Current: int;
  public PointsTomorrow: int;
  public PointsMax: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
