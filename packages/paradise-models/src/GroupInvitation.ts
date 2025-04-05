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

interface GroupInvitationAttributes {
  InviterName?: string;
  InviterCmid?: number;
  GroupId?: number;
  GroupName?: string;
  GroupTag?: string;
  GroupInvitationId?: number;
  InviteeName?: string;
  InviteeCmid?: number;
  Message?: string;
}

export default class GroupInvitation extends Model<GroupInvitationAttributes> {
  declare InviterName: string;
  declare InviterCmid: number;
  declare GroupId: number;
  declare GroupName: string;
  declare GroupTag: string;
  declare GroupInvitationId: number;
  declare InviteeName: string;
  declare InviteeCmid: number;
  declare Message: string;

  static initialize(sequelize: Sequelize) {
    GroupInvitation.init(
      {
        InviterName: DataTypes.STRING(18),
        InviterCmid: DataTypes.INTEGER,
        GroupId: DataTypes.INTEGER,
        GroupName: DataTypes.STRING(25),
        GroupTag: DataTypes.STRING(5),
        GroupInvitationId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        InviteeName: DataTypes.STRING(18),
        InviteeCmid: DataTypes.INTEGER,
        Message: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: 'GroupInvitations',
        timestamps: false,
      },
    );
  }

  static associate({ Clan, PublicProfile }: any) {
    GroupInvitation.belongsTo(Clan, {
      foreignKey: 'GroupId',
      targetKey: 'GroupId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    GroupInvitation.belongsTo(PublicProfile, {
      foreignKey: 'InviterCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    GroupInvitation.belongsTo(PublicProfile, {
      foreignKey: 'InviteeCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
