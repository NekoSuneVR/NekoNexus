import TeamID from './TeamID';

export default class StatsSummary {
  public Name: string;
  public Kills: int;
  public Deaths: int;
  public Level: int;
  public Cmid: int;
  public Team: TeamID;
  public Achievements: Dictionary<byte, ushort>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
