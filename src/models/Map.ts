import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface MapAttributes {
  MapId?: number;
  DisplayName?: string;
  Description?: string;
  SceneName?: { [key: string]: string };
  IsBlueBox?: boolean;
  RecommendedItemId?: number;
  SupportedGameModes?: number;
  SupportedItemClass?: number;
  MaxPlayers?: number;
  FileName?: { [key: string]: string };
}

export default class Map extends Model<MapAttributes> {
  declare MapId: number;
  declare DisplayName: string;
  declare Description: string;
  declare SceneName: { [key: string]: string };
  declare IsBlueBox: boolean;
  declare RecommendedItemId: number;
  declare SupportedGameModes: number;
  declare SupportedItemClass: number;
  declare MaxPlayers: number;
  declare FileName: { [key: string]: string };

  public static initialize(sequelize: Sequelize) {
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

  public static associate(_) {}
}
