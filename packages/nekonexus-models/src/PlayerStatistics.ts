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
  PlayerPersonalRecordStatisticsView,
  PlayerWeaponStatisticsView,
} from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

interface PlayerStatisticsAttributes {
  Cmid?: number;
  Splats?: number;
  Splatted?: number;
  Shots?: bigint;
  Hits?: bigint;
  Headshots?: number;
  Nutshots?: number;
  Xp?: number;
  Points?: number;
  Level?: number;
  TimeSpentInGame?: number;
  PersonalRecord?: PlayerPersonalRecordStatisticsView;
  WeaponStatistics?: PlayerWeaponStatisticsView;
}

export default class PlayerStatistics extends Model<PlayerStatisticsAttributes> {
  declare Cmid: number;
  declare Splats: number;
  declare Splatted: number;
  declare Shots: bigint;
  declare Hits: bigint;
  declare Headshots: number;
  declare Nutshots: number;
  declare Xp: number;
  declare Points: number;
  declare Level: number;
  declare TimeSpentInGame: number;
  declare PersonalRecord: PlayerPersonalRecordStatisticsView;
  declare WeaponStatistics: PlayerWeaponStatisticsView;

  static initialize(sequelize: Sequelize) {
    PlayerStatistics.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Splats: DataTypes.INTEGER,
        Splatted: DataTypes.INTEGER,
        Shots: DataTypes.BIGINT,
        Hits: DataTypes.BIGINT,
        Headshots: DataTypes.INTEGER,
        Nutshots: DataTypes.INTEGER,
        Xp: DataTypes.INTEGER,
        Points: DataTypes.INTEGER,
        Level: DataTypes.INTEGER,
        TimeSpentInGame: DataTypes.INTEGER,
        PersonalRecord: {
          type: DataTypes.JSON,
          get(this: PlayerStatistics): any {
            return JSON.parse(this.getDataValue('PersonalRecord') as any);
          },
          set(this: PlayerStatistics, value: any): any {
            this.setDataValue('PersonalRecord', JSON.stringify(value) as any);
          },
        },
        WeaponStatistics: {
          type: DataTypes.JSON,
          get(this: PlayerStatistics): any {
            return JSON.parse(this.getDataValue('WeaponStatistics') as any);
          },
          set(this: PlayerStatistics, value: any): any {
            this.setDataValue('WeaponStatistics', JSON.stringify(value) as any);
          },
        },
      },
      {
        sequelize,
        tableName: 'PlayerStatistics',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
