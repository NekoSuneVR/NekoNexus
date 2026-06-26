/*
 * Copyright (C) 2024 NekoSune Community
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import * as models from '@festivaldev/nekonexus-models';
import NekoNexusService from '@/NekoNexusService';
import { WebSocketPacketType } from '@/ServiceHosts/WebSocket';
import Log from './Log';

export interface BoostPayload {
  PointsMultiplier: number;
  XpMultiplier: number;
  /** Unix epoch milliseconds; 0 = no expiry. */
  EndsAt: number;
}

/**
 * Global "2x/5x" coin + xp boost event.
 *
 * The admin service owns the persisted value (the `GlobalBoost` table) the same way it owns wallet
 * writes, then best-effort calls the ws `/internal/set-boost` bridge so the running Game servers
 * pick the boost up instantly (no relog, no realtime restart). The ws keeps the latest value in
 * memory so it can re-push it to any Game server the moment it (re)connects - a Game-server restart
 * therefore can't silently drop an active event. On ws startup we seed that cache from the table so
 * a ws restart restores the event too.
 *
 * A multiplier of 1 (or an elapsed EndsAt) means "no boost".
 */
class BoostManagerImpl {
  private current: BoostPayload = { PointsMultiplier: 1, XpMultiplier: 1, EndsAt: 0 };

  /** Read the persisted boost on startup (tolerates the table not existing yet). */
  async initialize(): Promise<void> {
    try {
      const sequelize = (models as any).PhotonServer?.sequelize;
      if (!sequelize) return;

      const [rows] = (await sequelize.query(
        'SELECT PointsMultiplier, XpMultiplier, EndsAt FROM GlobalBoost WHERE Id = 1',
      )) as [any[], unknown];

      if (rows?.length) {
        this.current = {
          PointsMultiplier: Math.max(1, Number(rows[0].PointsMultiplier) || 1),
          XpMultiplier: Math.max(1, Number(rows[0].XpMultiplier) || 1),
          EndsAt: Number(rows[0].EndsAt) || 0,
        };
        Log.info(
          `Loaded global boost: ${this.current.PointsMultiplier}x coins / ${this.current.XpMultiplier}x xp (endsAt=${this.current.EndsAt}).`,
        );
      }
    } catch {
      // GlobalBoost table not created yet (no boost ever set) - run with no boost.
    }
  }

  /** Current boost as the wire payload Game servers expect. */
  get payload(): BoostPayload {
    return { ...this.current };
  }

  /** Cache a new boost value and broadcast it to every connected Game server. */
  applyAndBroadcast(points: number, xp: number, endsAt: number): void {
    this.current = {
      PointsMultiplier: Math.max(1, Math.trunc(points) || 1),
      XpMultiplier: Math.max(1, Math.trunc(xp) || 1),
      EndsAt: Math.max(0, Math.trunc(endsAt) || 0),
    };

    try {
      NekoNexusService.Instance.SocketHost?.SendToGameServers(WebSocketPacketType.SetBoost, this.current);
    } catch {
      // Best-effort: persisted value still applies on the next Game-server connect.
    }
  }

  /** Push the cached boost to a single Game server (called right after it connects). */
  pushTo(guid: string): void {
    try {
      NekoNexusService.Instance.SocketHost?.SendToGameServer(guid, WebSocketPacketType.SetBoost, this.current);
    } catch {
      /* best-effort */
    }
  }
}

const BoostManager = new BoostManagerImpl();
export default BoostManager;
