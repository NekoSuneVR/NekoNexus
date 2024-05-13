import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface MemberWalletAttributes {
  Cmid?: number;
  Credits?: number;
  Points?: number;
  CreditsExpiration?: Date;
  PointsExpiration?: Date;
}

export default class MemberWallet extends Model<MemberWalletAttributes> {
  declare Cmid: number;
  declare Credits: number;
  declare Points: number;
  declare CreditsExpiration: Date;
  declare PointsExpiration: Date;

  public static initialize(sequelize: Sequelize) {
    MemberWallet.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Credits: DataTypes.INTEGER,
        Points: DataTypes.INTEGER,
        CreditsExpiration: DataTypes.DATE,
        PointsExpiration: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'MemberWallets',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    MemberWallet.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
