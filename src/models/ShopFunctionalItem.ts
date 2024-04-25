import { ItemShopHighlightType, UberstrikeItemClass } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import { ShopItemAttributes } from './ShopItemAttributes';
import ShopItemPrice from './ShopItemPrice';

export interface ShopFunctionalItemAttributes extends ShopItemAttributes {}

export default class ShopFunctionalItem extends Model<ShopFunctionalItemAttributes> {
  declare ID: number;
  declare Name: string;
  declare PrefabName: string;
  declare Description: string;
  declare ItemClass: UberstrikeItemClass;
  declare LevelLock: number;
  declare MaxDurationDays: number;
  declare IsConsumable: boolean;
  declare ShopHighlightType: ItemShopHighlightType;
  declare CustomProperties: { [key: string]: string };
  declare ItemProperties: { [key: string]: string };

  declare Prices: ShopItemPrice[];

  public static initialize(sequelize: Sequelize) {
    ShopFunctionalItem.init(
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Name: DataTypes.STRING,
        PrefabName: DataTypes.STRING,
        Description: DataTypes.STRING,
        ItemClass: DataTypes.INTEGER,
        LevelLock: DataTypes.INTEGER,
        MaxDurationDays: DataTypes.INTEGER,
        IsConsumable: DataTypes.BOOLEAN,
        ShopHighlightType: DataTypes.INTEGER,
        CustomProperties: {
          type: DataTypes.JSON,
          defaultValue: {},
          get(this: ShopFunctionalItem): any {
            return JSON.parse(this.getDataValue('CustomProperties') as any);
          },
          set(this: ShopFunctionalItem, value: any): any {
            this.setDataValue('CustomProperties', JSON.stringify(value) as any);
          },
        },
        ItemProperties: {
          type: DataTypes.JSON,
          defaultValue: {},
          get(this: ShopFunctionalItem): any {
            return JSON.parse(this.getDataValue('ItemProperties') as any);
          },
          set(this: ShopFunctionalItem, value: any): any {
            this.setDataValue('ItemProperties', JSON.stringify(value) as any);
          },
        },
      },
      {
        sequelize,
        timestamps: false,
      },
    );
  }

  public static associate({ ShopItemPrice }) {
    ShopFunctionalItem.hasMany(ShopItemPrice, {
      as: 'Prices',
      constraints: false,
      foreignKey: 'ID',
      sourceKey: 'ID',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  public get IsForSale(): bool {
    return this.Prices?.length > 0;
  }
}
