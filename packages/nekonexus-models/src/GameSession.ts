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

import moment from 'moment';
import { DataTypes, Model, type Sequelize } from 'sequelize';
import PublicProfile from './PublicProfile';
import SteamMember from './SteamMember';

const SESSION_EXPIRE_HOURS = 12;

interface GameSessionAttributes {
  SessionId?: string;
  Cmid?: number;
  MachineId?: string;
  ExpireTime?: Date;
}

export default class GameSession extends Model<GameSessionAttributes> {
  declare SessionId: string;
  declare Cmid: number;
  declare MachineId: string;
  declare ExpireTime: Date;

  static initialize(sequelize: Sequelize) {
    GameSession.init(
      {
        SessionId: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        Cmid: DataTypes.INTEGER,
        MachineId: DataTypes.STRING,
        ExpireTime: {
          type: DataTypes.DATE,
          // defaultValue: function() {
          //   var date = new Date();
          //   date.setHours(date.getHours() + SESSION_EXPIRE_HOURS);

          //   return date;
          // }
        },
      },
      {
        sequelize,
        tableName: 'GameSessions',
        timestamps: false,
      },
    );
  }

  static associate({ PublicProfile }: any) {
    GameSession.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }

  extendExpireTime(): void {
    this.update({
      ExpireTime: moment(new Date()).add(SESSION_EXPIRE_HOURS, 'hours').toDate(),
    });
  }

  get Profile(): Promise<PublicProfile | null> {
    return PublicProfile.findOne({ where: { Cmid: this.Cmid } });
  }

  get SteamMember(): Promise<SteamMember | null> {
    return SteamMember.findOne({ where: { Cmid: this.Cmid } });
  }

  static getCmidFromSessionId(sessionId: string): number {
    if (!sessionId.trim().length) return -1;
    return Buffer.from([...Buffer.from(sessionId, 'base64')].slice(0, 4)).readInt32LE();
  }

  static getSteamIdFromSessionId(sessionId: string): bigint {
    if (!sessionId.trim().length) return -1n;
    return Buffer.from([...Buffer.from(sessionId, 'base64')].slice(4, 8)).readBigUInt64LE();
  }
}
