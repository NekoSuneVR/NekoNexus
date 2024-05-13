import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface PlayerMachineAttributes {
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

  public static initialize(sequelize: Sequelize) {
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

  public static associate({ PublicProfile }: any) {
    PlayerMachine.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
