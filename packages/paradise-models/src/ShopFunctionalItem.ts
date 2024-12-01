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

import type { ItemPropertyType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import type { ItemShopHighlightType, UberstrikeItemClass } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import type ShopItemAttributes from './ShopItemAttributes';
import type ShopItemPrice from './ShopItemPrice';

interface ShopFunctionalItemAttributes extends ShopItemAttributes {}

export default class ShopFunctionalItem extends Model<ShopFunctionalItemAttributes> {
  declare ID: number;
  declare Name: string;
  declare PrefabName: string;
  declare Description: string;
  declare ItemClass: UberstrikeItemClass;
  declare LevelLock: number;
  declare MaxDurationDays: number;
  declare IsConsumable: boolean;
  declare ShopHighlightType: ItemShopHighlightType;
  declare CustomProperties: Record<string, string>;
  declare ItemProperties: Record<ItemPropertyType, number>;

  declare Prices: ShopItemPrice[];

  static initialize(sequelize: Sequelize) {
    ShopFunctionalItem.init(
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Name: DataTypes.STRING,
        PrefabName: DataTypes.STRING,
        Description: DataTypes.STRING,
        ItemClass: DataTypes.INTEGER,
        LevelLock: DataTypes.INTEGER,
        MaxDurationDays: DataTypes.INTEGER,
        IsConsumable: DataTypes.BOOLEAN,
        ShopHighlightType: DataTypes.INTEGER,
        CustomProperties: {
          type: DataTypes.JSON,
          defaultValue: {},
          get(this: ShopFunctionalItem): any {
            return JSON.parse(this.getDataValue('CustomProperties') as any);
          },
          set(this: ShopFunctionalItem, value: any): any {
            this.setDataValue('CustomProperties', JSON.stringify(value) as any);
          },
        },
        ItemProperties: {
          type: DataTypes.JSON,
          defaultValue: {},
          get(this: ShopFunctionalItem): any {
            return JSON.parse(this.getDataValue('ItemProperties') as any);
          },
          set(this: ShopFunctionalItem, value: any): any {
            this.setDataValue('ItemProperties', JSON.stringify(value) as any);
          },
        },
      },
      {
        sequelize,
        tableName: 'ShopFunctionalItems',
        timestamps: false,
      },
    );
  }

  static associate({ ShopItemPrice }: any) {
    ShopFunctionalItem.hasMany(ShopItemPrice, {
      as: 'Prices',
      constraints: false,
      foreignKey: 'ID',
      sourceKey: 'ID',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  get IsForSale(): boolean {
    return this.Prices?.length > 0;
  }
}
