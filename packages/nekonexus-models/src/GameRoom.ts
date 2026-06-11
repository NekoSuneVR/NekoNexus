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

import type { GameModeType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface GameRoomAttributes {
  Number?: number;
  ServerIp?: string;
  ServerPort?: number;
  Name?: string;
  // Guid?: string;
  IsPasswordProtected?: boolean;
  GameMode?: GameModeType;
  PlayerLimit?: number;
  ConnectedPlayers?: number;
  TimeLimit?: number;
  KillLimit?: number;
  GameFlags?: number;
  MapID?: number;
  LevelMin?: number;
  LevelMax?: number;
  IsPermanentGame?: boolean;
  ChannelId?: string;
  WebhookUrl?: string;
}

export default class GameRoom extends Model<GameRoomAttributes> {
  declare Number: number;
  declare ServerIp: string;
  declare ServerPort: number;
  declare Name: string;
  // declare Guid: string;
  declare IsPasswordProtected: boolean;
  declare GameMode: GameModeType;
  declare PlayerLimit: number;
  declare ConnectedPlayers: number;
  declare TimeLimit: number;
  declare KillLimit: number;
  declare GameFlags: number;
  declare MapID: number;
  declare LevelMin: number;
  declare LevelMax: number;
  declare IsPermanentGame: boolean;
  declare ChannelId: string;
  declare WebhookUrl: string;

  static initialize(sequelize: Sequelize) {
    GameRoom.init(
      {
        Number: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        ServerIp: DataTypes.STRING,
        ServerPort: DataTypes.INTEGER,
        Name: DataTypes.STRING(18),
        IsPasswordProtected: DataTypes.BOOLEAN,
        GameMode: DataTypes.INTEGER,
        PlayerLimit: DataTypes.INTEGER,
        ConnectedPlayers: DataTypes.INTEGER,
        TimeLimit: DataTypes.INTEGER,
        KillLimit: DataTypes.INTEGER,
        GameFlags: DataTypes.INTEGER,
        MapID: DataTypes.INTEGER,
        LevelMin: DataTypes.INTEGER,
        LevelMax: DataTypes.INTEGER,
        IsPermanentGame: DataTypes.BOOLEAN,
        ChannelId: DataTypes.STRING,
        WebhookUrl: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'GameRooms',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
