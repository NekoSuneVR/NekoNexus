import { BuyingDurationType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { UberstrikeInventoryItem } from '@/utils';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ShopBundleItemAttributes {
  id?: number;
  BundleId?: number;
  ItemId?: UberstrikeInventoryItem;
  Amount?: number;
  Duration?: BuyingDurationType;
}

export default class ShopBundleItem extends Model<ShopBundleItemAttributes> {
  declare id: number;
  declare BundleId: number;
  declare ItemId: UberstrikeInventoryItem;
  declare Amount: number;
  declare Duration: BuyingDurationType;

  public static initialize(sequelize: Sequelize) {
    ShopBundleItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        BundleId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'ShopBundles',
            key: 'Id',
          },
        },
        ItemId: DataTypes.INTEGER,
        Amount: DataTypes.INTEGER,
        Duration: DataTypes.INTEGER,
      },
      {
        sequelize,
        defaultScope: {
          attributes: { exclude: ['id'] },
        },
        timestamps: false,
      },
    );
  }

  public static associate({ ShopBundle }) {
    ShopBundleItem.belongsTo(ShopBundle, {
      as: 'BundleItemViews',
      foreignKey: 'BundleId',
      targetKey: 'Id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
