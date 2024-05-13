import { GameModeType } from '@/UberStrike/Core/Types';
import PlayerStatisticsView from './PlayerStatisticsView';

export default class MatchView {
  [key: string]: any;

  public PlayersCompleted: List<PlayerStatisticsView>;
  public PlayersNonCompleted: List<PlayerStatisticsView>;
  public MapId: int;
  public GameModeId: GameModeType;
  public TimeLimit: int;
  public PlayersLimit: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
