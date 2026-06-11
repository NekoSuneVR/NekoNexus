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

interface ModerationActionAttributes {
  id?: number;
  ModerationFlag?: ModerationFlag;
  SourceCmid?: number;
  SourceName?: string;
  TargetCmid?: number;
  TargetName?: string;
  ActionDate?: Date;
  ExpireTime?: Date | null;
  Reason?: string;
}

export default class ModerationAction extends Model<ModerationActionAttributes> {
  declare id: number;
  declare ModerationFlag: ModerationFlag;
  declare SourceCmid: number;
  declare SourceName: string;
  declare TargetCmid: number;
  declare TargetName: string;
  declare ActionDate: Date;
  declare ExpireTime: Date | null;
  declare Reason: string;

  static initialize(sequelize: Sequelize) {
    ModerationAction.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ModerationFlag: DataTypes.INTEGER,
        SourceCmid: DataTypes.INTEGER,
        SourceName: DataTypes.STRING(18),
        TargetCmid: DataTypes.INTEGER,
        TargetName: DataTypes.STRING(18),
        ActionDate: DataTypes.DATE,
        ExpireTime: DataTypes.DATE,
        Reason: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: 'ModerationActions',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    ModerationAction.belongsTo(PublicProfile, {
      foreignKey: 'SourceCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    ModerationAction.belongsTo(PublicProfile, {
      foreignKey: 'TargetCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
