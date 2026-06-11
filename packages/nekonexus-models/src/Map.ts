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

interface MapAttributes {
  MapId?: number;
  DisplayName?: string;
  Description?: string;
  SceneName?: Record<string, string>;
  IsBlueBox?: boolean;
  RecommendedItemId?: number;
  SupportedGameModes?: number;
  SupportedItemClass?: number;
  MaxPlayers?: number;
  FileName?: Record<string, string>;
}

export default class Map extends Model<MapAttributes> {
  declare MapId: number;
  declare DisplayName: string;
  declare Description: string;
  declare SceneName: Record<string, string>;
  declare IsBlueBox: boolean;
  declare RecommendedItemId: number;
  declare SupportedGameModes: number;
  declare SupportedItemClass: number;
  declare MaxPlayers: number;
  declare FileName: Record<string, string>;

  static initialize(sequelize: Sequelize) {
    Map.init(
      {
        MapId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DisplayName: DataTypes.STRING,
        Description: DataTypes.TEXT,
        SceneName: {
          type: DataTypes.JSON,
          get(this: Map): any {
            return JSON.parse(this.getDataValue('SceneName') as any);
          },
        },
        IsBlueBox: DataTypes.BOOLEAN,
        RecommendedItemId: DataTypes.INTEGER,
        SupportedGameModes: DataTypes.INTEGER,
        SupportedItemClass: DataTypes.INTEGER,
        MaxPlayers: DataTypes.INTEGER,
        FileName: {
          type: DataTypes.JSON,
          get(this: Map): any {
            return JSON.parse(this.getDataValue('FileName') as any);
          },
        },
      },
      {
        sequelize,
        tableName: 'Maps',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
