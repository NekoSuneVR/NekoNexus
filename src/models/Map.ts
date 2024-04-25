import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface MapAttributes {
  MapId?: number;
  DisplayName?: string;
  Description?: string;
  SceneName?: string;
  IsBlueBox?: boolean;
  RecommendedItemId?: number;
  SupportedGameModes?: number;
  SupportedItemClass?: number;
  MaxPlayers?: number;
  FileName?: string | null;
}

export default class Map extends Model<MapAttributes> {
  declare MapId: number;
  declare DisplayName: string;
  declare Description: string;
  declare SceneName: string;
  declare IsBlueBox: boolean;
  declare RecommendedItemId: number;
  declare SupportedGameModes: number;
  declare SupportedItemClass: number;
  declare MaxPlayers: number;
  declare FileName: string;

  public static initialize(sequelize: Sequelize) {
    Map.init(
      {
        MapId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DisplayName: DataTypes.STRING,
        Description: DataTypes.TEXT,
        SceneName: DataTypes.STRING,
        IsBlueBox: DataTypes.BOOLEAN,
        RecommendedItemId: DataTypes.INTEGER,
        SupportedGameModes: DataTypes.INTEGER,
        SupportedItemClass: DataTypes.INTEGER,
        MaxPlayers: DataTypes.INTEGER,
        FileName: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'Maps',
        timestamps: false,
      },
    );
  }

  public static associate(_) {}
}
