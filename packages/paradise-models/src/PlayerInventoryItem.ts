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

import { DataTypes, Model, type Sequelize } from 'sequelize';

interface PlayerInventoryItemAttributes {
  Cmid?: number;
  ItemId?: UberstrikeInventoryItem;
  ExpirationDate?: Date | null;
  AmountRemaining?: number;
}

export default class PlayerInventoryItem extends Model<PlayerInventoryItemAttributes> {
  declare Cmid: number;
  declare ItemId: UberstrikeInventoryItem;
  declare ExpirationDate: Date | null;
  declare AmountRemaining: number;

  static initialize(sequelize: Sequelize) {
    PlayerInventoryItem.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        ItemId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        ExpirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        AmountRemaining: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'PlayerInventoryItems',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    PlayerInventoryItem.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
