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

import type { PointsDepositType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface PointDepositAttributes {
  PointDepositId?: number;
  DepositDate?: Date;
  Points?: number;
  Cmid?: number;
  IsAdminAction?: boolean;
  DepositType?: PointsDepositType;
}

export default class PointDeposit extends Model<PointDepositAttributes> {
  declare PointDepositId: number;
  declare DepositDate: Date;
  declare Points: number;
  declare Cmid: number;
  declare IsAdminAction: boolean;
  declare DepositType: PointsDepositType;

  static initialize(sequelize: Sequelize) {
    PointDeposit.init(
      {
        PointDepositId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DepositDate: DataTypes.DATE,
        Points: DataTypes.INTEGER,
        Cmid: DataTypes.INTEGER,
        IsAdminAction: DataTypes.BOOLEAN,
        DepositType: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'PointDeposits',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    PointDeposit.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
