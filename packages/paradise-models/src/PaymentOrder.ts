/*
 * Tracks a NekoPay checkout for a credit purchase, so the webhook can grant credits
 * exactly once and admins can audit payments.
 */

import { DataTypes, Model, type Sequelize } from 'sequelize';

interface PaymentOrderAttributes {
  Id?: number;
  ExternalId?: string; // our id, sent to NekoPay as externalId
  SessionId?: string; // NekoPay session id (filled after creation)
  Cmid?: number; // player to credit
  Credits?: number; // credits to grant on completion
  PriceCents?: number;
  Currency?: string;
  Status?: string; // created | pending | completed | failed | cancelled
  Fulfilled?: boolean; // credits granted (idempotency guard)
}

export default class PaymentOrder extends Model<PaymentOrderAttributes> {
  declare Id: number;
  declare ExternalId: string;
  declare SessionId: string;
  declare Cmid: number;
  declare Credits: number;
  declare PriceCents: number;
  declare Currency: string;
  declare Status: string;
  declare Fulfilled: boolean;

  static initialize(sequelize: Sequelize) {
    PaymentOrder.init(
      {
        Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        ExternalId: { type: DataTypes.STRING(64), allowNull: false, unique: true },
        SessionId: DataTypes.STRING(128),
        Cmid: { type: DataTypes.INTEGER, allowNull: false },
        Credits: { type: DataTypes.INTEGER, allowNull: false },
        PriceCents: DataTypes.INTEGER,
        Currency: { type: DataTypes.STRING(8), defaultValue: 'USD' },
        Status: { type: DataTypes.STRING(16), defaultValue: 'created' },
        Fulfilled: { type: DataTypes.BOOLEAN, defaultValue: false },
      },
      { sequelize, tableName: 'PaymentOrders', timestamps: true },
    );
  }

  static associate(_: any) {}
}
