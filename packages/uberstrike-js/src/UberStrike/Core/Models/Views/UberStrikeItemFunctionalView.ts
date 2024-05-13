import { UberstrikeItemType } from '@/UberStrike/Core/Types';
import BaseUberStrikeItemView from './BaseUberStrikeItemView';

export default class UberStrikeItemFunctionalView extends BaseUberStrikeItemView {
  public override get ItemType(): UberstrikeItemType {
    return UberstrikeItemType.Functional;
  }
}
