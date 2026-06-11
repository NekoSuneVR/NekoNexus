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

import type { BuyingDurationType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface ItemTransactionAttributes {
  WithdrawalId?: number;
  WithdrawalDate?: Date;
  Points?: number;
  Credits?: number;
  Cmid?: number;
  IsAdminAction?: boolean;
  ItemId?: UberstrikeInventoryItem;
  Duration?: BuyingDurationType;
}

export default class ItemTransaction extends Model<ItemTransactionAttributes> {
  declare WithdrawalId: number;
  declare WithdrawalDate: Date;
  declare Points: number;
  declare Credits: number;
  declare Cmid: number;
  declare IsAdminAction: boolean;
  declare ItemId: UberstrikeInventoryItem;
  declare Duration: BuyingDurationType;

  static initialize(sequelize: Sequelize) {
    ItemTransaction.init(
      {
        WithdrawalId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        WithdrawalDate: DataTypes.DATE,
        Points: DataTypes.INTEGER,
        Credits: DataTypes.INTEGER,
        Cmid: DataTypes.INTEGER,
        IsAdminAction: DataTypes.BOOLEAN,
        ItemId: DataTypes.INTEGER,
        Duration: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'ItemTransactions',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    ItemTransaction.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
