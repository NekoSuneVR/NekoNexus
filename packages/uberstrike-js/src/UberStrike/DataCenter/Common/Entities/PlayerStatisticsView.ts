import PlayerPersonalRecordStatisticsView from './PlayerPersonalRecordStatisticsView';
import PlayerWeaponStatisticsView from './PlayerWeaponStatisticsView';

export default class PlayerStatisticsView {
  [key: string]: any;

  public Cmid: int;
  public Splats: int;
  public Splatted: int;
  public Shots: long;
  public Hits: long;
  public Headshots: int;
  public Nutshots: int;
  public Xp: int;
  public Points: int; // # LEGACY # //
  public Level: int;
  public TimeSpentInGame: int;
  public PersonalRecord: PlayerPersonalRecordStatisticsView;
  public WeaponStatistics: PlayerWeaponStatisticsView;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[PlayerStatisticsView: [Cmid: ${this.Cmid}][Hits: ${this.Hits}][Level: ${this.Level}][Shots: ${this.Shots}][Splats: ${this.Splats}][Splatted: ${this.Splatted}][Headshots: ${this.Headshots}][Nutshots: ${this.Nutshots}][Xp: ${this.Xp}][Points: ${this.Points}]${this.PersonalRecord}${this.WeaponStatistics}]`;
  }
}
