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

interface ApplicationConfigurationAttributes {
  ApplicationId?: number;
  XpRequiredPerLevel?: Record<string, number>;
  MaxLevel?: number;
  MaxXp?: number;
  XpKill?: number;
  XpSmackdown?: number;
  XpHeadshot?: number;
  XpNutshot?: number;
  XpPerMinuteLoser?: number;
  XpPerMinuteWinner?: number;
  XpBaseLoser?: number;
  XpBaseWinner?: number;
  PointsKill?: number;
  PointsSmackdown?: number;
  PointsHeadshot?: number;
  PointsNutshot?: number;
  PointsPerMinuteLoser?: number;
  PointsPerMinuteWinner?: number;
  PointsBaseLoser?: number;
  PointsBaseWinner?: number;
}

export default class ApplicationConfiguration extends Model<ApplicationConfigurationAttributes> {
  declare ApplicationId: number;
  declare XpRequiredPerLevel: Record<string, number>;
  declare MaxLevel: number;
  declare MaxXp: number;
  declare XpKill: number;
  declare XpSmackdown: number;
  declare XpHeadshot: number;
  declare XpNutshot: number;
  declare XpPerMinuteLoser: number;
  declare XpPerMinuteWinner: number;
  declare XpBaseLoser: number;
  declare XpBaseWinner: number;
  declare PointsKill: number;
  declare PointsSmackdown: number;
  declare PointsHeadshot: number;
  declare PointsNutshot: number;
  declare PointsPerMinuteLoser: number;
  declare PointsPerMinuteWinner: number;
  declare PointsBaseLoser: number;
  declare PointsBaseWinner: number;

  static initialize(sequelize: Sequelize) {
    ApplicationConfiguration.init(
      {
        ApplicationId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        XpRequiredPerLevel: {
          type: DataTypes.JSON,
          get(this: ApplicationConfiguration): any {
            return JSON.parse(this.getDataValue('XpRequiredPerLevel') as any);
          },
        },
        MaxLevel: DataTypes.INTEGER,
        MaxXp: DataTypes.INTEGER,
        XpKill: DataTypes.INTEGER,
        XpSmackdown: DataTypes.INTEGER,
        XpHeadshot: DataTypes.INTEGER,
        XpNutshot: DataTypes.INTEGER,
        XpPerMinuteLoser: DataTypes.INTEGER,
        XpPerMinuteWinner: DataTypes.INTEGER,
        XpBaseLoser: DataTypes.INTEGER,
        XpBaseWinner: DataTypes.INTEGER,
        PointsKill: DataTypes.INTEGER,
        PointsSmackdown: DataTypes.INTEGER,
        PointsHeadshot: DataTypes.INTEGER,
        PointsNutshot: DataTypes.INTEGER,
        PointsPerMinuteLoser: DataTypes.INTEGER,
        PointsPerMinuteWinner: DataTypes.INTEGER,
        PointsBaseLoser: DataTypes.INTEGER,
        PointsBaseWinner: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'ApplicationConfiguration',
        timestamps: false,
      },
    );
  }

  static associate(_: any) {}
}
