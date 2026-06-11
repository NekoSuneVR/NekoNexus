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

import { EmailAddressStatus, MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, Op, Utils, type Sequelize } from 'sequelize';

export interface PublicProfileAttributes {
  Cmid?: number;
  Name?: string;
  IsChatDisabled?: boolean;
  AccessLevel?: MemberAccessLevel;
  GroupTag?: string | null;
  LastLoginDate?: string | Date;
  EmailAddressStatus?: EmailAddressStatus;
  FacebookId?: string;
}

export default class PublicProfile extends Model<PublicProfileAttributes> {
  declare Cmid: number;
  declare Name: string;
  declare IsChatDisabled: boolean;
  declare AccessLevel: MemberAccessLevel;
  declare GroupTag: string | null;
  declare LastLoginDate: string | Date;
  declare EmailAddressStatus: EmailAddressStatus;
  declare FacebookId: string;

  static initialize(sequelize: Sequelize) {
    PublicProfile.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Name: {
          type: DataTypes.STRING(18),
          // unique: true,
        },
        IsChatDisabled: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        AccessLevel: {
          type: DataTypes.INTEGER,
          defaultValue: MemberAccessLevel.Default,
        },
        GroupTag: DataTypes.STRING(5),
        LastLoginDate: DataTypes.DATE,
        EmailAddressStatus: DataTypes.INTEGER,
        FacebookId: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'PublicProfiles',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}

  static async getProfile(search: string): Promise<PublicProfile | null> {
    return PublicProfile.findOne({
      where: {
        Cmid: {
          [Op.gt]: 0,
        },
        [Op.or]: [
          {
            Name: {
              [Op.like]: `%${search.toLocaleLowerCase()}%`,
            },
          },
          new Utils.Where(new Utils.Col('Cmid'), 'LIKE', `%${search.toLocaleLowerCase()}%`),
        ],
      },
      order: [['Name', 'ASC']],
    });
  }

  static async getProfiles(search: string): Promise<any> {
    return PublicProfile.findAll({
      where: {
        Cmid: {
          [Op.gt]: 0,
        },
        [Op.or]: [
          {
            Name: {
              [Op.like]: `%${search.toLocaleLowerCase()}%`,
            },
          },
          new Utils.Where(new Utils.Col('Cmid'), 'LIKE', `%${search.toLocaleLowerCase()}%`),
        ],
      },
      order: [['Name', 'ASC']],
    });
  }
}
