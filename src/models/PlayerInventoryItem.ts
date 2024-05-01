import { UberstrikeInventoryItem } from '@/utils';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface PlayerInventoryItemAttributes {
  Cmid?: number;
  ItemId?: UberstrikeInventoryItem;
  ExpirationDate?: Date | null;
  AmountRemaining?: number;
}

export default class PlayerInventoryItem extends Model<PlayerInventoryItemAttributes> {
  declare Cmid: number;
  declare ItemId: UberstrikeInventoryItem;
  declare ExpirationDate: Date | null;
  declare AmountRemaining: number;

  public static initialize(sequelize: Sequelize) {
    PlayerInventoryItem.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        ItemId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        ExpirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        AmountRemaining: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'PlayerInventoryItems',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    PlayerInventoryItem.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
