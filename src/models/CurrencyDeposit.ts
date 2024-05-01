import { ChannelType, PaymentProviderType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface CurrencyDepositAttributes {
  CreditsDepositId?: number;
  DepositDate?: Date;
  Credits?: number;
  Points?: number;
  Cash?: number;
  CurrencyLabel?: string;
  Cmid?: number;
  IsAdminAction?: boolean;
  PaymentProviderId?: PaymentProviderType;
  TransactionKey?: string;
  ApplicationId?: number;
  ChannelId?: ChannelType;
  UsdAmount?: number;
  BundleId?: number;
  BundleName?: string;
}

export default class CurrencyDeposit extends Model<CurrencyDepositAttributes> {
  declare CreditsDepositId: number;
  declare DepositDate: Date;
  declare Credits: number;
  declare Points: number;
  declare Cash: number;
  declare CurrencyLabel: string;
  declare Cmid: number;
  declare IsAdminAction: boolean;
  declare PaymentProviderId: PaymentProviderType;
  declare TransactionKey: string;
  declare ApplicationId: number;
  declare ChannelId: ChannelType;
  declare UsdAmount: number;
  declare BundleId: number;
  declare BundleName: string;

  public static initialize(sequelize: Sequelize) {
    CurrencyDeposit.init(
      {
        CreditsDepositId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        DepositDate: DataTypes.DATE,
        Credits: DataTypes.INTEGER,
        Points: DataTypes.INTEGER,
        Cash: DataTypes.DECIMAL,
        CurrencyLabel: DataTypes.STRING,
        Cmid: DataTypes.INTEGER,
        IsAdminAction: DataTypes.BOOLEAN,
        PaymentProviderId: DataTypes.INTEGER,
        TransactionKey: DataTypes.STRING,
        ApplicationId: DataTypes.INTEGER,
        ChannelId: DataTypes.INTEGER,
        UsdAmount: DataTypes.DECIMAL,
        BundleId: DataTypes.INTEGER,
        BundleName: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'CurrencyDeposits',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    CurrencyDeposit.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
