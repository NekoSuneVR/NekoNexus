/*
 * A purchasable bundle of in-game Credits (real money -> credits via NekoPay).
 */

import { DataTypes, Model, type Sequelize } from 'sequelize';

interface CreditPackageAttributes {
  Id?: number;
  Name?: string;
  Credits?: number;
  PriceCents?: number; // price in minor units (e.g. cents) to avoid float issues
  Currency?: string;
  Enabled?: boolean;
}

export default class CreditPackage extends Model<CreditPackageAttributes> {
  declare Id: number;
  declare Name: string;
  declare Credits: number;
  declare PriceCents: number;
  declare Currency: string;
  declare Enabled: boolean;

  static initialize(sequelize: Sequelize) {
    CreditPackage.init(
      {
        Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Name: { type: DataTypes.STRING(128), allowNull: false },
        Credits: { type: DataTypes.INTEGER, allowNull: false },
        PriceCents: { type: DataTypes.INTEGER, allowNull: false },
        Currency: { type: DataTypes.STRING(8), defaultValue: 'USD' },
        Enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
      },
      { sequelize, tableName: 'CreditPackages', timestamps: true },
    );
  }

  static associate(_: any) {}
}
