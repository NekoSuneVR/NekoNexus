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

import type { ChannelType, PaymentProviderType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface CurrencyDepositAttributes {
  CreditsDepositId?: number;
  DepositDate?: Date;
  Credits?: number;
  Points?: number;
  Cash?: number;
  CurrencyLabel?: string;
  Cmid?: number;
  IsAdminAction?: boolean;
  PaymentProviderId?: PaymentProviderType;
  TransactionKey?: string;
  ApplicationId?: number;
  ChannelId?: ChannelType;
  UsdAmount?: number;
  BundleId?: number;
  BundleName?: string;
}

export default class CurrencyDeposit extends Model<CurrencyDepositAttributes> {
  declare CreditsDepositId: number;
  declare DepositDate: Date;
  declare Credits: number;
  declare Points: number;
  declare Cash: number;
  declare CurrencyLabel: string;
  declare Cmid: number;
  declare IsAdminAction: boolean;
  declare PaymentProviderId: PaymentProviderType;
  declare TransactionKey: string;
  declare ApplicationId: number;
  declare ChannelId: ChannelType;
  declare UsdAmount: number;
  declare BundleId: number;
  declare BundleName: string;

  static initialize(sequelize: Sequelize) {
    CurrencyDeposit.init(
      {
        CreditsDepositId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DepositDate: DataTypes.DATE,
        Credits: DataTypes.INTEGER,
        Points: DataTypes.INTEGER,
        Cash: DataTypes.DECIMAL,
        CurrencyLabel: DataTypes.STRING,
        Cmid: DataTypes.INTEGER,
        IsAdminAction: DataTypes.BOOLEAN,
        PaymentProviderId: DataTypes.INTEGER,
        TransactionKey: DataTypes.STRING,
        ApplicationId: DataTypes.INTEGER,
        ChannelId: DataTypes.INTEGER,
        UsdAmount: DataTypes.DECIMAL,
        BundleId: DataTypes.INTEGER,
        BundleName: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'CurrencyDeposits',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    CurrencyDeposit.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
