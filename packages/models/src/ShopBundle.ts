import { BundleCategoryType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import { ShopBundleItem } from '.';

export interface ShopBundleAttributes {
  Id?: number;
  ApplicationId?: number;
  Name?: string;
  ImageUrl?: string;
  IconUrl?: string;
  Description?: string;
  IsOnSale?: boolean;
  IsPromoted?: boolean;
  USDPrice?: number;
  USDPromoPrice?: number;
  Credits?: number;
  Points?: number;
  Category?: BundleCategoryType;
  Availability?: number[];
  PromotionTag?: string;
  MacAppStoreUniqueId?: string;
  IosAppStoreUniqueId?: string;
  AndroidStoreUniqueId?: string;
  IsDefault?: boolean;

  BundleItemViews?: ShopBundleItem[];
}

export default class ShopBundle extends Model<ShopBundleAttributes> {
  declare Id: number;
  declare ApplicationId: number;
  declare Name: string;
  declare ImageUrl: string;
  declare IconUrl: string;
  declare Description: string;
  declare IsOnSale: boolean;
  declare IsPromoted: boolean;
  declare USDPrice: number;
  declare USDPromoPrice: number;
  declare Credits: number;
  declare Points: number;
  declare Category: BundleCategoryType;
  declare Availability: number[];
  declare PromotionTag: string;
  declare MacAppStoreUniqueId: string;
  declare IosAppStoreUniqueId: string;
  declare AndroidStoreUniqueId: string;
  declare IsDefault: boolean;

  declare BundleItemViews: ShopBundleItem[];

  public static initialize(sequelize: Sequelize) {
    ShopBundle.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        ApplicationId: DataTypes.INTEGER,
        Name: DataTypes.STRING,
        ImageUrl: DataTypes.STRING,
        IconUrl: DataTypes.STRING,
        Description: DataTypes.TEXT,
        IsOnSale: DataTypes.BOOLEAN,
        IsPromoted: DataTypes.BOOLEAN,
        USDPrice: DataTypes.DECIMAL,
        USDPromoPrice: DataTypes.DECIMAL,
        Credits: DataTypes.INTEGER,
        Points: DataTypes.INTEGER,
        // BundleItemViews
        Category: DataTypes.INTEGER,
        Availability: {
          type: DataTypes.JSON,
          get(this: ShopBundle): any {
            return JSON.parse(this.getDataValue('Availability') as any);
          },
          set(this: ShopBundle, value: any): any {
            this.setDataValue('Availability', JSON.stringify(value) as any);
          },
        },
        PromotionTag: DataTypes.STRING,
        MacAppStoreUniqueId: DataTypes.STRING,
        IosAppStoreUniqueId: DataTypes.STRING,
        AndroidStoreUniqueId: DataTypes.STRING,
        IsDefault: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'ShopBundles',
        timestamps: false,
      },
    );
  }

  public static associate({ ShopBundleItem }: any) {
    ShopBundle.hasMany(ShopBundleItem, {
      as: 'BundleItemViews',
      foreignKey: 'BundleId',
      sourceKey: 'Id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
