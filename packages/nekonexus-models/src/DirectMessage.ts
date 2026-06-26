/*
 * One row per friend-DM chat message (a persistent 1-on-1 thread on the website). Distinct from
 * PrivateMessage (mail) and from the ephemeral in-game whisper: a website DM is stored here so the
 * conversation has history, and is also pushed into the in-game whisper channel if the friend is
 * online. Sender/recipient are in-game CMIDs.
 */

import { DataTypes, Model, type Sequelize } from 'sequelize';

interface DirectMessageAttributes {
  Id?: number;
  FromCmid?: number;
  FromName?: string;
  ToCmid?: number;
  Text?: string;
  DateSent?: Date;
  IsRead?: boolean;
}

export default class DirectMessage extends Model<DirectMessageAttributes> {
  declare Id: number;
  declare FromCmid: number;
  declare FromName: string;
  declare ToCmid: number;
  declare Text: string;
  declare DateSent: Date;
  declare IsRead: boolean;

  static initialize(sequelize: Sequelize) {
    DirectMessage.init(
      {
        Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        FromCmid: { type: DataTypes.INTEGER, allowNull: false },
        FromName: DataTypes.STRING(32),
        ToCmid: { type: DataTypes.INTEGER, allowNull: false },
        Text: DataTypes.STRING(255),
        DateSent: DataTypes.DATE,
        IsRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      },
      {
        sequelize,
        tableName: 'DirectMessages',
        timestamps: false,
        indexes: [{ fields: ['ToCmid'] }, { fields: ['FromCmid'] }],
      },
    );
  }

  static associate(_: any) {}
}
