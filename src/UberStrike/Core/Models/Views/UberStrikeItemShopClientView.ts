import UberStrikeItemFunctionalView from './UberStrikeItemFunctionalView';
import UberStrikeItemGearView from './UberStrikeItemGearView';
import UberStrikeItemQuickView from './UberStrikeItemQuickView';
import UberStrikeItemWeaponView from './UberStrikeItemWeaponView';

export default class UberStrikeItemShopClientView {
  [key: string]: any;

  public FunctionalItems: List<UberStrikeItemFunctionalView>;
  public GearItems: List<UberStrikeItemGearView>;
  public QuickItems: List<UberStrikeItemQuickView>;
  public WeaponItems: List<UberStrikeItemWeaponView>;
  public ItemsRecommendationPerMap: Dictionary<int, int>; // # LEGACY # //

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
