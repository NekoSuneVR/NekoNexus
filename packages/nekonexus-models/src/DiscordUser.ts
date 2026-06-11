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

interface DiscordUserAttributes {
  Cmid?: number;
  DiscordUserId?: string | null;
  Nonce?: string | null;
  Completed?: boolean;
}

export default class DiscordUser extends Model<DiscordUserAttributes> {
  declare Cmid: number;
  declare DiscordUserId: string | null;
  declare Nonce: string | null;
  declare Completed: boolean;

  static initialize(sequelize: Sequelize) {
    DiscordUser.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DiscordUserId: DataTypes.STRING,
        Nonce: {
          type: DataTypes.TEXT,
          unique: true,
        },
        Completed: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'DiscordUsers',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    DiscordUser.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
