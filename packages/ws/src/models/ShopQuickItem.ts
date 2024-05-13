import { ItemShopHighlightType, UberstrikeItemClass } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import { ShopItemAttributes } from './ShopItemAttributes';
import ShopItemPrice from './ShopItemPrice';

export interface ShopGearItemAttributes extends ShopItemAttributes {
  UsesPerLife?: number;
  UsesPerRound?: number;
  UsesPerGame?: number;
  CoolDownTime?: number;
  WarmUpTime?: number;
  MaxOwnableAmount?: number;
  BehaviourType?: number;
}

export default class ShopQuickItem extends Model<ShopGearItemAttributes> {
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

  // QuickItem specific
  declare UsesPerLife: number;
  declare UsesPerRound: number;
  declare UsesPerGame: number;
  declare CoolDownTime: number;
  declare WarmUpTime: number;
  declare MaxOwnableAmount: number;
  declare BehaviourType: number;

  declare Prices: ShopItemPrice[];

  public static initialize(sequelize: Sequelize) {
    ShopQuickItem.init(
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
          get(this: ShopQuickItem): any {
            return JSON.parse(this.getDataValue('CustomProperties') as any);
          },
          set(this: ShopQuickItem, value: any): any {
            this.setDataValue('CustomProperties', JSON.stringify(value) as any);
          },
        },
        ItemProperties: {
          type: DataTypes.JSON,
          defaultValue: {},
          get(this: ShopQuickItem): any {
            return JSON.parse(this.getDataValue('ItemProperties') as any);
          },
          set(this: ShopQuickItem, value: any): any {
            this.setDataValue('ItemProperties', JSON.stringify(value) as any);
          },
        },

        // QuickItem Specific
        UsesPerLife: DataTypes.INTEGER,
        UsesPerRound: DataTypes.INTEGER,
        UsesPerGame: DataTypes.INTEGER,
        CoolDownTime: DataTypes.INTEGER,
        WarmUpTime: DataTypes.INTEGER,
        MaxOwnableAmount: DataTypes.INTEGER,
        BehaviourType: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'ShopQuickItems',
        timestamps: false,
      },
    );
  }

  public static associate({ ShopItemPrice }: any) {
    ShopQuickItem.hasMany(ShopItemPrice, {
      as: 'Prices',
      constraints: false,
      foreignKey: 'ID',
      sourceKey: 'ID',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  public get IsForSale(): boolean {
    return this.Prices?.length > 0;
  }
}
