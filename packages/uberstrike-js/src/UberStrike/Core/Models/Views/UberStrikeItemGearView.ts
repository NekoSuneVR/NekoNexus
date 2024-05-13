import { UberstrikeItemType } from '@/UberStrike/Core/Types';
import BaseUberStrikeItemView from './BaseUberStrikeItemView';

export default class UberStrikeItemGearView extends BaseUberStrikeItemView {
  public override get ItemType(): UberstrikeItemType {
    return UberstrikeItemType.Gear;
  }

  public ArmorPoints: int;
  public ArmorWeight: int;
  public ArmorAbsorptionPercent: int; // # LEGACY # //
}
