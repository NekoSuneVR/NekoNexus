import { PhotonUsageType, RegionType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface PhotonServerAttributes {
  PhotonId?: number;
  IP?: string;
  Name?: string;
  Region?: RegionType;
  Port?: number;
  UsageType?: PhotonUsageType;
  MinLatency?: number;
  LastResponseTime?: Date;
  Guid?: string;
}

export default class PhotonServer extends Model<PhotonServerAttributes> {
  declare PhotonId: number;
  declare IP: string;
  declare Name: string;
  declare Region: RegionType;
  declare Port: number;
  declare UsageType: PhotonUsageType;
  declare MinLatency: number;
  declare LastReponseTime: Date;
  declare Guid: string;

  public static initialize(sequelize: Sequelize) {
    PhotonServer.init(
      {
        PhotonId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        IP: DataTypes.STRING,
        Name: DataTypes.STRING,
        Region: DataTypes.INTEGER,
        Port: DataTypes.INTEGER,
        UsageType: DataTypes.INTEGER,
        MinLatency: DataTypes.INTEGER,
        LastResponseTime: DataTypes.DATE,
        Guid: DataTypes.STRING(36),
      },
      {
        sequelize,
        timestamps: false,
      },
    );
  }

  public static associate(_) {}
}
