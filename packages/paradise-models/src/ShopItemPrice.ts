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

import type {
  BuyingDurationType,
  PackType,
  UberStrikeCurrencyType,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface ShopItemPriceAttributes {
  ID?: number;
  Price?: number;
  Currency?: UberStrikeCurrencyType;
  Discount?: number;
  Amount?: number;
  PackType?: PackType;
  Duration?: BuyingDurationType;
}

export default class ShopItemPrice extends Model<ShopItemPriceAttributes> {
  declare ID: number;
  declare Price: number;
  declare Currency: UberStrikeCurrencyType;
  declare Discount: number;
  declare Amount: number;
  declare PackType: PackType;
  declare Duration: BuyingDurationType;

  static initialize(sequelize: Sequelize) {
    ShopItemPrice.init(
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Price: DataTypes.INTEGER,
        Currency: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Discount: DataTypes.INTEGER,
        Amount: DataTypes.INTEGER,
        PackType: DataTypes.INTEGER,
        Duration: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'ShopItemPrices',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
