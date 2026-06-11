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

import { GameSession, type SteamMember, type UserAccount } from '@festivaldev/nekonexus-models';
import type { PublicProfileView } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { Op } from 'sequelize';

const SESSION_EXPIRE_HOURS: number = 12;

export default class GameSessionManager {
  private Seed: bigint = BigInt(new Date().getTime());

  private static GarbageCollector: any;

  constructor() {
    if (!GameSessionManager.GarbageCollector) {
      GameSessionManager.GarbageCollector = setInterval(
        () => {
          GameSession.destroy({
            where: {
              ExpireTime: {
                [Op.lte]: new Date(),
              },
            },
          });
        },
        1000 * 60 * 5,
      );
    }
  }

  async findOrCreateSession(profile: PublicProfileView, machineId: string, userAccount: UserAccount): Promise<any> {
    const expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + SESSION_EXPIRE_HOURS);

    const [session, isCreated] = await GameSession.findOrCreate({
      where: {
        Cmid: profile.Cmid,
        ExpireTime: {
          [Op.gt]: new Date(),
        },
      },
      defaults: {
        SessionId: this.createSessionId(profile.Cmid),
        Cmid: profile.Cmid,
        MachineId: machineId,
        ExpireTime: expireTime,
      },
    });

    if (!isCreated) {
      session.extendExpireTime();
    }

    return session;
  }

  async findOrCreateSessionForSteamUser(
    profile: PublicProfileView,
    machineId: string,
    steamMember: SteamMember,
  ): Promise<any> {
    const expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + SESSION_EXPIRE_HOURS);

    const [session, isCreated] = await GameSession.findOrCreate({
      where: {
        Cmid: profile.Cmid,
        ExpireTime: {
          [Op.gt]: new Date(),
        },
      },
      defaults: {
        SessionId: this.createSessionIdForSteamUser(profile.Cmid, BigInt(steamMember.SteamId)),
        Cmid: profile.Cmid,
        MachineId: machineId,
        ExpireTime: expireTime,
      },
    });

    if (!isCreated) {
      session.extendExpireTime();
    }

    return session;
  }

  async findSessionByPlayerId(id: number): Promise<any> {
    const [session, isCreated] = await GameSession.findOrCreate({
      where: {
        Cmid: id,
        ExpireTime: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!isCreated) {
      session.extendExpireTime();
    }

    return session;
  }

  async findSessionForSteamUser(sessionId: string): Promise<any> {
    return this.findSessionByPlayerId(GameSession.getCmidFromSessionId(sessionId));
  }

  private createSessionId(cmid: number): string {
    const sessionId: Buffer = Buffer.alloc(20);

    const seed = this.Seed;
    this.Seed = (this.Seed + 1n) & 0xffffffffffffffn;

    sessionId.writeInt32LE(cmid);
    sessionId.writeBigInt64LE(BigInt(new Date().getTime()), 4);
    sessionId.writeBigInt64LE(seed, 12);

    return sessionId.toString('base64');
  }

  private createSessionIdForSteamUser(cmid: number, steamId: bigint): string {
    const sessionId: Buffer = Buffer.alloc(20);

    const seed = this.Seed;
    this.Seed = (this.Seed + 1n) & 0xffffffffffffffn;

    sessionId.writeInt32LE(cmid);
    sessionId.writeBigInt64LE(steamId, 4);
    sessionId.writeBigInt64LE(seed, 12);

    return sessionId.toString('base64');
  }
}
