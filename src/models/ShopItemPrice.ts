import {
  BuyingDurationType,
  PackType,
  UberStrikeCurrencyType,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ShopItemPriceAttributes {
  ID?: number;
  Price?: number;
  Currency?: UberStrikeCurrencyType;
  Discount?: number;
  Amount?: number;
  PackType?: PackType;
  Duration?: BuyingDurationType;
}

export default class ShopItemPrice extends Model<ShopItemPriceAttributes> {
  declare ID: number;
  declare Price: number;
  declare Currency: UberStrikeCurrencyType;
  declare Discount: number;
  declare Amount: number;
  declare PackType: PackType;
  declare Duration: BuyingDurationType;

  public static initialize(sequelize: Sequelize) {
    ShopItemPrice.init(
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Price: DataTypes.INTEGER,
        Currency: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Discount: DataTypes.INTEGER,
        Amount: DataTypes.INTEGER,
        PackType: DataTypes.INTEGER,
        Duration: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
      },
      {
        sequelize,
        timestamps: false,
      },
    );
  }

  public static associate(_) {}
}
