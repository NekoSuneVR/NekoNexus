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

interface SteamMemberAttributes {
  SteamId?: string;
  Cmid?: number;
  AuthToken?: string;
  MachineId?: string;
}

export default class SteamMember extends Model<SteamMemberAttributes> {
  declare SteamId: string;
  declare Cmid: number;
  declare AuthToken: string;
  declare MachineId: string;

  static initialize(sequelize: Sequelize) {
    SteamMember.init(
      {
        SteamId: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        Cmid: DataTypes.INTEGER,
        AuthToken: DataTypes.STRING,
        MachineId: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'SteamMembers',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    SteamMember.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
