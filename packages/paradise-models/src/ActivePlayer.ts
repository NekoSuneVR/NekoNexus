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

import { ChannelType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ActivePlayerAttributes {
  Cmid?: number;
  IPAddress?: string;
  Channel?: ChannelType;
  CommServerId?: number | null;
  GameServerId?: number | null;
  GameRoomId?: number | null;
}

export default class ActivePlayer extends Model<ActivePlayerAttributes> {
  declare Cmid: number;
  declare IPAddress: string;
  declare Channel: ChannelType;
  declare CommServerId: number | null;
  declare GameServerId: number | null;
  declare GameRoomId: number | null;

  static initialize(sequelize: Sequelize) {
    ActivePlayer.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        IPAddress: DataTypes.STRING,
        Channel: DataTypes.INTEGER,
        CommServerId: DataTypes.INTEGER,
        GameServerId: DataTypes.INTEGER,
        GameRoomId: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'ActivePlayers',
        timestamps: false,
      },
    );
  }

  static associate(models: any) {
    const { PublicProfile } = models;

    ActivePlayer.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
