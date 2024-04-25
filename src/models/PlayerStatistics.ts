import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface PlayerStatisticsAttributes {
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
  PersonalRecord?: { [key: string]: any };
  WeaponStatistics?: { [key: string]: any };
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
  declare PersonalRecord: { [key: string]: any };
  declare WeaponStatistics: { [key: string]: any };

  public static initialize(sequelize: Sequelize) {
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

  public static associate(_) {}
}
