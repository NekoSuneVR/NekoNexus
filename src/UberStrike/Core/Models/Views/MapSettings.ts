export default class MapSettings {
  public KillsMin: int;
  public KillsMax: int;
  public KillsCurrent: int;
  public PlayersMin: int;
  public PlayersMax: int;
  public PlayersCurrent: int;
  public TimeMin: int;
  public TimeMax: int;
  public TimeCurrent: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
