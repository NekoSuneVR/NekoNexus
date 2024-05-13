export default class MatchPointsView {
  [key: string]: any;

  public WinnerPointsBase: int;
  public LoserPointsBase: int;
  public WinnerPointsPerMinute: int;
  public LoserPointsPerMinute: int;
  public MaxTimeInGame: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
