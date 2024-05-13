import { GameModeType } from '@/UberStrike/Core/Types';
import RoomData from './RoomData';

export default class GameRoomData extends RoomData {
  public ConnectedPlayers: int;
  public PlayerLimit: int;
  public TimeLimit: int;
  public KillLimit: int;
  public GameFlags: int;
  public MapID: int;
  public LevelMin: byte;
  public LevelMax: byte;
  public GameMode: GameModeType;
  public IsPermanentGame: bool;

  public get IsFull(): bool {
    return this.ConnectedPlayers >= this.PlayerLimit;
  }
}
