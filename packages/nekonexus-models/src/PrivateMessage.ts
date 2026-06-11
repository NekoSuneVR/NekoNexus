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

interface PrivateMessageAttributes {
  PrivateMessageId?: number;
  FromCmid?: number;
  FromName?: string;
  ToCmid?: number;
  DateSent?: Date;
  ContentText?: string;
  IsRead?: boolean;
  HasAttachment?: boolean;
  IsDeletedBySender?: boolean;
  IsDeletedByReceiver?: boolean;
}

export default class PrivateMessage extends Model<PrivateMessageAttributes> {
  declare PrivateMessageId: number;
  declare FromCmid: number;
  declare FromName: string;
  declare ToCmid: number;
  declare DateSent: Date;
  declare ContentText: string;
  declare IsRead: boolean;
  declare HasAttachment: boolean;
  declare IsDeletedBySender: boolean;
  declare IsDeletedByReceiver: boolean;

  static initialize(sequelize: Sequelize) {
    PrivateMessage.init(
      {
        PrivateMessageId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        FromCmid: DataTypes.INTEGER,
        FromName: DataTypes.STRING(18),
        ToCmid: DataTypes.INTEGER,
        DateSent: DataTypes.DATE,
        ContentText: DataTypes.TEXT,
        IsRead: DataTypes.BOOLEAN,
        HasAttachment: DataTypes.BOOLEAN,
        IsDeletedBySender: DataTypes.BOOLEAN,
        IsDeletedByReceiver: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'PrivateMessages',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    PrivateMessage.belongsTo(PublicProfile, {
      foreignKey: 'FromCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    PrivateMessage.belongsTo(PublicProfile, {
      foreignKey: 'ToCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
