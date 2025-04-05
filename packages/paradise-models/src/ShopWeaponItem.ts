/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import type { ItemPropertyType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import type { ItemShopHighlightType, UberstrikeItemClass } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import type ShopItemAttributes from './ShopItemAttributes';
import type ShopItemPrice from './ShopItemPrice';

interface ShopWeaponItemAttributes extends ShopItemAttributes {
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
  declare CustomProperties: Record<string, string>;
  declare ItemProperties: Record<ItemPropertyType, number>;

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

  static initialize(sequelize: Sequelize) {
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

  static associate({ ShopItemPrice }: any) {
    ShopWeaponItem.hasMany(ShopItemPrice, {
      as: 'Prices',
      constraints: false,
      foreignKey: 'ID',
      sourceKey: 'ID',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  get IsForSale(): boolean {
    return this.Prices?.length > 0;
  }
}
