import { GameModeType } from '@/UberStrike/Core/Types';
import PlayerMatchStats from './PlayerMatchStats';

export default class MatchStats {
  public Players: List<PlayerMatchStats>;
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
