import { UberstrikeInventoryItem } from '@/utils';
import { BuyingDurationType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ItemTransactionAttributes {
  WithdrawalId?: number;
  WithdrawalDate?: Date;
  Points?: number;
  Credits?: number;
  Cmid?: number;
  IsAdminAction?: boolean;
  ItemId?: UberstrikeInventoryItem;
  Duration?: BuyingDurationType;
}

export default class ItemTransaction extends Model<ItemTransactionAttributes> {
  declare WithdrawalId: number;
  declare WithdrawalDate: Date;
  declare Points: number;
  declare Credits: number;
  declare Cmid: number;
  declare IsAdminAction: boolean;
  declare ItemId: UberstrikeInventoryItem;
  declare Duration: BuyingDurationType;

  public static initialize(sequelize: Sequelize) {
    ItemTransaction.init(
      {
        WithdrawalId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        WithdrawalDate: DataTypes.DATE,
        Points: DataTypes.INTEGER,
        Credits: DataTypes.INTEGER,
        Cmid: DataTypes.INTEGER,
        IsAdminAction: DataTypes.BOOLEAN,
        ItemId: DataTypes.INTEGER,
        Duration: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'ItemTransactions',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    ItemTransaction.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
