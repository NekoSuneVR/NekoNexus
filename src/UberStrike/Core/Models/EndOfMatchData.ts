import StatsCollection from './StatsCollection';
import StatsSummary from './StatsSummary';

export default class EndOfMatchData {
  public MostValuablePlayers: List<StatsSummary>;
  public MostEffecientWeaponId: int;
  public PlayerStatsTotal: StatsCollection;
  public PlayerStatsBestPerLife: StatsCollection;
  public PlayerXpEarned: Dictionary<byte, ushort>;
  public TimeInGameMinutes: int;
  public HasWonMatch: bool;
  public MatchGuid: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
