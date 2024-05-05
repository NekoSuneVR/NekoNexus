import { GameModeType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface GameRoomAttributes {
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

  public static initialize(sequelize: Sequelize) {
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

  public static associate(_: any) {}
}
