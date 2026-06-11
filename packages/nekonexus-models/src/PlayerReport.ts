/*
 * A player-submitted report against another player (cheating, abuse, etc.). Surfaced to staff in the
 * admin dashboard, where it can be marked reviewed/resolved.
 */

import { DataTypes, Model, type Sequelize } from 'sequelize';

interface PlayerReportAttributes {
  Id?: number;
  ReporterCmid?: number;
  ReporterName?: string;
  TargetCmid?: number;
  TargetName?: string;
  Reason?: string; // short category (cheating / abuse / name / other)
  Details?: string; // free-text description
  Status?: string; // open | reviewed | resolved | dismissed
}

export default class PlayerReport extends Model<PlayerReportAttributes> {
  declare Id: number;
  declare ReporterCmid: number;
  declare ReporterName: string;
  declare TargetCmid: number;
  declare TargetName: string;
  declare Reason: string;
  declare Details: string;
  declare Status: string;

  static initialize(sequelize: Sequelize) {
    PlayerReport.init(
      {
        Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        ReporterCmid: { type: DataTypes.INTEGER, allowNull: false },
        ReporterName: { type: DataTypes.STRING(32), allowNull: true },
        TargetCmid: { type: DataTypes.INTEGER, allowNull: false },
        TargetName: { type: DataTypes.STRING(32), allowNull: true },
        Reason: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'other' },
        Details: { type: DataTypes.TEXT, allowNull: true },
        Status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: 'open' },
      },
      { sequelize, tableName: 'PlayerReports', timestamps: true },
    );
  }

  static associate(_: any) {}
}
