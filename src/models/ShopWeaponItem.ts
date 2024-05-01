import { ItemShopHighlightType, UberstrikeItemClass } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import { ShopItemAttributes } from './ShopItemAttributes';
import ShopItemPrice from './ShopItemPrice';

export interface ShopWeaponItemAttributes extends ShopItemAttributes {
  AccuracySpread?: number;
  CombatRange?: number;
  CriticalStrikeBonus?: number;
  DamageKnockback?: number;
  DamagePerProjectile?: number;
  DefaultZoomMultiplier?: number;
  HasAutomaticFire?: boolean;
  MaxAmmo?: number;
  MaxZoomMultiplier?: number;
  MinZoomMultiplier?: number;
  MissileBounciness?: number;
  MissileForceImpulse?: number;
  MissileTimeToDetonate?: number;
  ProjectileSpeed?: number;
  ProjectilesPerShot?: number;
  RateOfFire?: number;
  RecoilKickback?: number;
  RecoilMovement?: number;
  SecondaryActionReticle?: number;
  SplashRadius?: number;
  StartAmmo?: number;
  Tier?: number;
  WeaponSecondaryAction?: number;

  Prices?: ShopItemPrice[];
}

export default class ShopWeaponItem extends Model<ShopWeaponItemAttributes> {
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

  declare AccuracySpread: number;
  declare CombatRange: number;
  declare CriticalStrikeBonus: number;
  declare DamageKnockback: number;
  declare DamagePerProjectile: number;
  declare DefaultZoomMultiplier: number;
  declare HasAutomaticFire: boolean;
  declare MaxAmmo: number;
  declare MaxZoomMultiplier: number;
  declare MinZoomMultiplier: number;
  declare MissileBounciness: number;
  declare MissileForceImpulse: number;
  declare MissileTimeToDetonate: number;
  declare ProjectileSpeed: number;
  declare ProjectilesPerShot: number;
  declare RateOfFire: number;
  declare RecoilKickback: number;
  declare RecoilMovement: number;
  declare SecondaryActionReticle: number;
  declare SplashRadius: number;
  declare StartAmmo: number;
  declare Tier: number;
  declare WeaponSecondaryAction: number;

  declare Prices: ShopItemPrice[];

  public static initialize(sequelize: Sequelize) {
    ShopWeaponItem.init(
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
          get(this: ShopWeaponItem): any {
            return JSON.parse(this.getDataValue('CustomProperties') as any);
          },
          set(this: ShopWeaponItem, value: any): any {
            this.setDataValue('CustomProperties', JSON.stringify(value) as any);
          },
        },
        ItemProperties: {
          type: DataTypes.JSON,
          defaultValue: {},
          get(this: ShopWeaponItem): any {
            return JSON.parse(this.getDataValue('ItemProperties') as any);
          },
          set(this: ShopWeaponItem, value: any): any {
            this.setDataValue('ItemProperties', JSON.stringify(value) as any);
          },
        },

        // Weapon Specific
        AccuracySpread: DataTypes.INTEGER,
        CombatRange: DataTypes.INTEGER,
        CriticalStrikeBonus: DataTypes.INTEGER,
        DamageKnockback: DataTypes.INTEGER,
        DamagePerProjectile: DataTypes.INTEGER,
        DefaultZoomMultiplier: DataTypes.INTEGER,
        HasAutomaticFire: DataTypes.BOOLEAN,
        MaxAmmo: DataTypes.INTEGER,
        MaxZoomMultiplier: DataTypes.INTEGER,
        MinZoomMultiplier: DataTypes.INTEGER,
        MissileBounciness: DataTypes.INTEGER,
        MissileForceImpulse: DataTypes.INTEGER,
        MissileTimeToDetonate: DataTypes.INTEGER,
        ProjectileSpeed: DataTypes.INTEGER,
        ProjectilesPerShot: DataTypes.INTEGER,
        RateOfFire: DataTypes.INTEGER,
        RecoilKickback: DataTypes.INTEGER,
        RecoilMovement: DataTypes.INTEGER,
        SecondaryActionReticle: DataTypes.INTEGER,
        SplashRadius: DataTypes.INTEGER,
        StartAmmo: DataTypes.INTEGER,
        Tier: DataTypes.INTEGER,
        WeaponSecondaryAction: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'ShopWeaponItems',
        timestamps: false,
      },
    );
  }

  public static associate({ ShopItemPrice }: any) {
    ShopWeaponItem.hasMany(ShopItemPrice, {
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
