import { PointsDepositType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface PointDepositAttributes {
  PointDepositId?: number;
  DepositDate?: Date;
  Points?: number;
  Cmid?: number;
  IsAdminAction?: boolean;
  DepositType?: PointsDepositType;
}

export default class PointDeposit extends Model<PointDepositAttributes> {
  declare PointDepositId: number;
  declare DepositDate: Date;
  declare Points: number;
  declare Cmid: number;
  declare IsAdminAction: boolean;
  declare DepositType: PointsDepositType;

  public static initialize(sequelize: Sequelize) {
    PointDeposit.init(
      {
        PointDepositId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DepositDate: DataTypes.DATE,
        Points: DataTypes.INTEGER,
        Cmid: DataTypes.INTEGER,
        IsAdminAction: DataTypes.BOOLEAN,
        DepositType: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'PointDeposits',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    PointDeposit.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
