import { QuickItemLogic, UberstrikeItemType } from '@/UberStrike/Core/Types';
import BaseUberStrikeItemView from './BaseUberStrikeItemView';

export default class UberStrikeItemQuickView extends BaseUberStrikeItemView {
  public override get ItemType(): UberstrikeItemType {
    return UberstrikeItemType.QuickUse;
  }

  public UsesPerLife: int;
  public UsesPerRound: int;
  public UsesPerGame: int;
  public CoolDownTime: int;
  public WarmUpTime: int;
  public MaxOwnableAmount: int;
  public BehaviourType: QuickItemLogic;
}
