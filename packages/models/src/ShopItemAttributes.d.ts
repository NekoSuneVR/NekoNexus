import { ItemShopHighlightType, UberstrikeItemClass } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';

export interface ShopItemAttributes {
  ID?: number;
  Name?: string;
  PrefabName?: string;
  Description?: string;
  ItemClass?: UberstrikeItemClass;
  LevelLock?: number;
  MaxDurationDays?: number;
  IsConsumable?: boolean;
  ShopHighlightType?: ItemShopHighlightType;
  CustomProperties?: { [key: string]: string };
  ItemProperties?: { [key: string]: string };
}
