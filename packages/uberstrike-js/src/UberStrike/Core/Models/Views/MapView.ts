import { GameModeType } from '@/UberStrike/Core/Types';
import MapSettings from './MapSettings';

export default class MapView {
  [key: string]: any;

  public MapId: int;
  public DisplayName: string;
  public Description: string;
  public SceneName: string;
  public IsBlueBox: bool;
  public RecommendedItemId: int;
  public SupportedGameModes: int;
  public SupportedItemClass: int;
  public MaxPlayers: int;
  public FileName: string; // # LEGACY # //
  public Settings: Dictionary<GameModeType, MapSettings>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
