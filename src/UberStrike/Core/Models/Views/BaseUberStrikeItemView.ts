import { ItemPropertyType } from '@/Cmune/DataCenter/Common/Entities';
import { ItemShopHighlightType, UberstrikeItemClass, UberstrikeItemType } from '@/UberStrike/Core/Types';
import ItemPrice from './ItemPrice';

export default abstract class BaseUberStrikeItemView {
  [key: string]: any;

  private _itemClass: UberstrikeItemClass;
  public abstract get ItemType(): UberstrikeItemType;

  public get ItemClass(): UberstrikeItemClass {
    return this._itemClass;
  }
  public set ItemClass(value: UberstrikeItemClass) {
    this._itemClass = value;
  }

  public ID: int;
  public Name: string;
  public PrefabName: string;
  public Description: string;
  public LevelLock: int;
  public MaxDurationDays: int;
  public IsConsumable: bool;
  public Prices: List<ItemPrice>;

  public get IsForSale(): bool {
    return this.Prices != null && this.Prices.length > 0;
  }

  public ShopHighlightType: ItemShopHighlightType;
  public CustomProperties: Dictionary<string, string>;
  public ItemProperties: Dictionary<ItemPropertyType, int>;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
