/*
 * One row per player per finished match — the match history shown on profiles / the API.
 * Written by the web service when the realtime game server reports a match result.
 */

import { DataTypes, Model, type Sequelize } from 'sequelize';

interface MatchRecordAttributes {
  Id?: number;
  Cmid?: number;
  MatchGuid?: string;
  MapId?: number;
  GameMode?: number; // UberStrike GameModeType (1 = DeathMatch, 2 = TeamDeathMatch, 4 = EliminationMode, ...)
  Kills?: number;
  Deaths?: number;
  Won?: boolean; // team won, or (DeathMatch) finished top place
  Xp?: number; // gained this match
  Points?: number; // gained this match
}

export default class MatchRecord extends Model<MatchRecordAttributes> {
  declare Id: number;
  declare Cmid: number;
  declare MatchGuid: string;
  declare MapId: number;
  declare GameMode: number;
  declare Kills: number;
  declare Deaths: number;
  declare Won: boolean;
  declare Xp: number;
  declare Points: number;

  static initialize(sequelize: Sequelize) {
    MatchRecord.init(
      {
        Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        Cmid: { type: DataTypes.INTEGER, allowNull: false },
        MatchGuid: DataTypes.STRING(64),
        MapId: DataTypes.INTEGER,
        GameMode: DataTypes.INTEGER,
        Kills: { type: DataTypes.INTEGER, defaultValue: 0 },
        Deaths: { type: DataTypes.INTEGER, defaultValue: 0 },
        Won: { type: DataTypes.BOOLEAN, defaultValue: false },
        Xp: { type: DataTypes.INTEGER, defaultValue: 0 },
        Points: { type: DataTypes.INTEGER, defaultValue: 0 },
      },
      {
        sequelize,
        tableName: 'MatchRecords',
        timestamps: true, // createdAt = when the match finished
        indexes: [{ fields: ['Cmid'] }],
      },
    );
  }

  static associate(_: any) {}
}
