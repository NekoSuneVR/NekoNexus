/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ItemPropertyType } from '@/Cmune/DataCenter/Common/Entities';
import { ItemShopHighlightType, UberstrikeItemClass, UberstrikeItemType } from '@/UberStrike/Core/Types';
import ItemPrice from './ItemPrice';

export default abstract class BaseUberStrikeItemView {
  private _itemClass: UberstrikeItemClass;
  abstract get ItemType(): UberstrikeItemType;

  get ItemClass(): UberstrikeItemClass {
    return this._itemClass;
  }

  set ItemClass(value: UberstrikeItemClass) {
    this._itemClass = value;
  }

  ID: number;
  Name: string;
  PrefabName: string;
  Description: string;
  LevelLock: number;
  MaxDurationDays: number;
  IsConsumable: boolean;
  Prices: ItemPrice[];

  get IsForSale(): boolean {
    return this.Prices != null && this.Prices.length > 0;
  }

  ShopHighlightType: ItemShopHighlightType;
  CustomProperties: { [key: string]: string };
  ItemProperties: Record<ItemPropertyType, number>;

  constructor(params: Partial<BaseUberStrikeItemView> = {}) {
    Object.assign(this, params);
  }
}
