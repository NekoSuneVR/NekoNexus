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

interface PlayerMachineAttributes {
  SystemIdentifier?: string;
  SystemModel?: string;
  SystemDeviceType?: number;
  SystemOperatingSystem?: string;
  SystemProcessorType?: string;
  SystemCoreCount?: number;
  SystemMemory?: number;
  GPUVendor?: string;
  GPUModel?: string;
  GPUVendorID?: string;
  GPUModelID?: string;
  GPUMemory?: number;
  GPUDriverVersion?: string;
  Cmid?: number;
}

export default class PlayerMachine extends Model<PlayerMachineAttributes> {
  declare SystemIdentifier: string;
  declare SystemModel: string;
  declare SystemDeviceType: number;
  declare SystemOperatingSystem: string;
  declare SystemProcessorType: string;
  declare SystemCoreCount: number;
  declare SystemMemory: number;
  declare GPUVendor: string;
  declare GPUModel: string;
  declare GPUVendorID: string;
  declare GPUModelID: string;
  declare GPUMemory: number;
  declare GPUDriverVersion: string;
  declare Cmid: number;

  static initialize(sequelize: Sequelize) {
    PlayerMachine.init(
      {
        SystemIdentifier: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        SystemModel: DataTypes.STRING,
        SystemDeviceType: DataTypes.INTEGER,
        SystemOperatingSystem: DataTypes.STRING,
        SystemProcessorType: DataTypes.STRING,
        SystemCoreCount: DataTypes.INTEGER,
        SystemMemory: DataTypes.INTEGER,
        GPUVendor: DataTypes.STRING,
        GPUModel: DataTypes.STRING,
        GPUVendorID: DataTypes.STRING,
        GPUModelID: DataTypes.STRING,
        GPUMemory: DataTypes.INTEGER,
        GPUDriverVersion: DataTypes.STRING,
        Cmid: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'PlayerMachines',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    PlayerMachine.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
