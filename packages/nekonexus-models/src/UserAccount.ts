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

import type { ChannelType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import type { TutorialStepType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface UserAccountAttributes {
  Cmid?: number;
  EmailAddress?: string;
  Password?: string;
  Channel?: ChannelType;
  Locale?: string;
  TutorialStep?: TutorialStepType;
}

export default class UserAccount extends Model<UserAccountAttributes> {
  declare Cmid: number;
  declare EmailAddress: string;
  declare Password: string;
  declare Channel: ChannelType;
  declare Locale: string;
  declare TutorialStep: TutorialStepType;

  static initialize(sequelize: Sequelize) {
    UserAccount.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        EmailAddress: DataTypes.STRING,
        Password: DataTypes.STRING,
        Channel: DataTypes.INTEGER,
        Locale: DataTypes.STRING,
        TutorialStep: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'UserAccounts',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
