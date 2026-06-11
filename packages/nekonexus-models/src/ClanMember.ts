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

import type { GroupPosition } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface ClanMemberAttributes {
  GroupId?: number;
  Name?: string;
  Cmid?: number;
  Position?: GroupPosition;
  JoiningDate?: string | Date;
  Lastlogin?: string | Date;
}

export default class ClanMember extends Model<ClanMemberAttributes> {
  declare GroupId: number;
  declare Name: string;
  declare Cmid: number;
  declare Position: GroupPosition;
  declare JoiningDate: string | Date;
  declare Lastlogin: string | Date;

  static initialize(sequelize: Sequelize) {
    ClanMember.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Name: DataTypes.STRING(18),
        GroupId: DataTypes.INTEGER,
        Position: DataTypes.INTEGER,
        JoiningDate: DataTypes.DATE,
        Lastlogin: DataTypes.DATE,
      },
      {
        sequelize,
        defaultScope: {
          attributes: { exclude: ['GroupId'] },
        },
        tableName: 'ClanMembers',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
