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
  GroupColor,
  GroupFontStyle,
  GroupType,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import ClanMember from './ClanMember';

interface ClanAttributes {
  GroupId?: number;
  MembersCount?: number;
  Description?: string;
  Name?: string;
  Motto?: string;
  Address?: string;
  FoundingDate?: Date;
  Picture?: string;
  Type?: GroupType;
  LastUpdated?: Date;
  Tag?: string;
  MembersLimit?: number;
  ColorStyle?: GroupColor;
  FontStyle?: GroupFontStyle;
  ApplicationId?: number;
  OwnerCmid?: number;
  OwnerName?: string;

  Members?: ClanMember[];
}

export default class Clan extends Model<ClanAttributes> {
  declare GroupId: number;
  declare MembersCount: number;
  declare Description: string;
  declare Name: string;
  declare Motto: string;
  declare Address: string;
  declare FoundingDate: Date;
  declare Picture: string;
  declare Type: number;
  declare LastUpdated: Date;
  declare Tag: string;
  declare MembersLimit: number;
  declare ColorStyle: GroupColor;
  declare FontStyle: GroupFontStyle;
  declare ApplicationId: number;
  declare OwnerCmid: number;
  declare OwnerName: string;

  declare Members: ClanMember[];

  static initialize(sequelize: Sequelize) {
    Clan.init(
      {
        GroupId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        MembersCount: DataTypes.INTEGER,
        Description: DataTypes.TEXT,
        Name: {
          type: DataTypes.STRING(25),
          unique: true,
        },
        Motto: DataTypes.STRING(25),
        Address: DataTypes.STRING,
        FoundingDate: DataTypes.DATE,
        Picture: DataTypes.STRING,
        Type: DataTypes.INTEGER,
        LastUpdated: DataTypes.DATE,
        Tag: {
          type: DataTypes.STRING(5),
          unique: true,
        },
        MembersLimit: DataTypes.INTEGER,
        ColorStyle: DataTypes.INTEGER,
        FontStyle: DataTypes.INTEGER,
        ApplicationId: DataTypes.INTEGER,
        OwnerCmid: {
          type: DataTypes.INTEGER,
          unique: true,
        },
        OwnerName: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'Clans',
        timestamps: false,
      },
    );
  }

  static associate({ ClanMember, PublicProfile }: any) {
    Clan.hasMany(ClanMember, {
      as: 'Members',
      foreignKey: 'GroupId',
      sourceKey: 'GroupId',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Clan.belongsTo(PublicProfile, {
      foreignKey: 'OwnerCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
