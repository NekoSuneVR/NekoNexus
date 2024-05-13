import { QuickItemLogic } from '@/UberStrike/Core/Types';

export default class ItemQuickUseConfigView {
  [key: string]: any;

  public ItemId: int;
  public LevelRequired: int;
  public UsesPerLife: int;
  public UsesPerRound: int;
  public UsesPerGame: int;
  public CoolDownTime: int;
  public WarmUpTime: int;
  public BehaviourType: QuickItemLogic;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
