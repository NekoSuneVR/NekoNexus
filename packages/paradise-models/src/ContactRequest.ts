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

import type { ContactRequestStatus } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface ContactRequestAttributes {
  RequestId?: number;
  InitiatorCmid?: number;
  InitiatorName?: string;
  ReceiverCmid?: number;
  InitiatorMessage?: string;
  Status?: ContactRequestStatus;
  SentDate?: Date;
}

export default class ContactRequest extends Model<ContactRequestAttributes> {
  declare RequestId: number;
  declare InitiatorCmid: number;
  declare InitiatorName: string;
  declare ReceiverCmid: number;
  declare InitiatorMessage: string;
  declare Status: ContactRequestStatus;
  declare SentDate: Date;

  static initialize(sequelize: Sequelize) {
    ContactRequest.init(
      {
        RequestId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        InitiatorCmid: DataTypes.INTEGER,
        InitiatorName: DataTypes.STRING(18),
        ReceiverCmid: DataTypes.INTEGER,
        InitiatorMessage: DataTypes.TEXT,
        Status: DataTypes.INTEGER,
        SentDate: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'ContactRequests',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    ContactRequest.belongsTo(PublicProfile, {
      foreignKey: 'InitiatorCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    ContactRequest.belongsTo(PublicProfile, {
      foreignKey: 'ReceiverCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
