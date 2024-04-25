import { GameModeType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface MapSettingsAttributes {
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

  public static initialize(sequelize: Sequelize) {
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

  static associate(_) {}
}
