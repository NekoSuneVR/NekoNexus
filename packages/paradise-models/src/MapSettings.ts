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

interface MapSettingsAttributes {
  MapId?: number;
  GameModeType?: GameModeType;
  KillsMin?: number;
  KillsMax?: number;
  KillsCurrent?: number;
  PlayersMin?: number;
  PlayersMax?: number;
  PlayersCurrent?: number;
  TimeMin?: number;
  TimeMax?: number;
  TimeCurrent?: number;
}

export default class MapSettings extends Model<MapSettingsAttributes> {
  declare MapId: number;
  declare GameModeType: GameModeType;
  declare KillsMin: number;
  declare KillsMax: number;
  declare KillsCurrent: number;
  declare PlayersMin: number;
  declare PlayersMax: number;
  declare PlayersCurrent: number;
  declare TimeMin: number;
  declare TimeMax: number;
  declare TimeCurrent: number;

  static initialize(sequelize: Sequelize) {
    MapSettings.init(
      {
        MapId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        GameModeType: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        KillsMin: DataTypes.INTEGER,
        KillsMax: DataTypes.INTEGER,
        KillsCurrent: DataTypes.INTEGER,
        PlayersMin: DataTypes.INTEGER,
        PlayersMax: DataTypes.INTEGER,
        PlayersCurrent: DataTypes.INTEGER,
        TimeMin: DataTypes.INTEGER,
        TimeMax: DataTypes.INTEGER,
        TimeCurrent: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'MapSettings',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
