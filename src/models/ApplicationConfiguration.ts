import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ApplicationConfigurationAttributes {
  id?: number;
  XpRequiredPerLevel?: { [key: string]: number };
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
  declare id: number;
  declare XpRequiredPerLevel: { [key: string]: number };
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

  public static initialize(sequelize: Sequelize) {
    ApplicationConfiguration.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        XpRequiredPerLevel: {
          type: DataTypes.JSON,
          get(this: ApplicationConfiguration): any {
            return JSON.parse(this.getDataValue('XpRequiredPerLevel') as any);
          },
          set(this: ApplicationConfiguration, value: any): any {
            this.setDataValue('XpRequiredPerLevel', JSON.stringify(value) as any);
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

  public static associate(_) {}
}
