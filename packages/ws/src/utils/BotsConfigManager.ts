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

export interface BotsConfigPayload {
  Enabled: boolean;
  FillTarget: number;
  MaxBots: number;
}

/**
 * Admin-controlled AI fill-bots toggle (BETA, off by default).
 *
 * Same pattern as BoostManager: the admin service owns the persisted value (the `BotsConfig`
 * table), then best-effort calls the ws `/internal/set-bots-config` bridge so running Game
 * servers pick the change up instantly (no realtime restart). The ws keeps the latest value in
 * memory so it can re-push it to any Game server the moment it (re)connects - a Game-server
 * restart therefore can't silently re-enable/disable bots against the admin's last choice. On ws
 * startup we seed that cache from the table so a ws restart doesn't lose it either.
 */
class BotsConfigManagerImpl {
  private current: BotsConfigPayload = { Enabled: false, FillTarget: 6, MaxBots: 5 };

  /** Read the persisted config on startup (tolerates the table not existing yet). */
  async initialize(): Promise<void> {
    try {
      const sequelize = (models as any).PhotonServer?.sequelize;
      if (!sequelize) return;

      const [rows] = (await sequelize.query(
        'SELECT Enabled, FillTarget, MaxBots FROM BotsConfig WHERE Id = 1',
      )) as [any[], unknown];

      if (rows?.length) {
        this.current = {
          Enabled: !!Number(rows[0].Enabled),
          FillTarget: Math.max(0, Number(rows[0].FillTarget) || 6),
          MaxBots: Math.max(0, Number(rows[0].MaxBots) || 5),
        };
        Log.info(
          `Loaded bots config: enabled=${this.current.Enabled}, fillTarget=${this.current.FillTarget}, maxBots=${this.current.MaxBots}.`,
        );
      }
    } catch {
      // BotsConfig table not created yet (admin page never opened) - run with bots disabled.
    }
  }

  /** Current config as the wire payload Game servers expect. */
  get payload(): BotsConfigPayload {
    return { ...this.current };
  }

  /** Cache a new config value and broadcast it to every connected Game server. */
  applyAndBroadcast(enabled: boolean, fillTarget: number, maxBots: number): void {
    this.current = {
      Enabled: !!enabled,
      FillTarget: Math.max(0, Math.trunc(fillTarget) || 0),
      MaxBots: Math.max(0, Math.trunc(maxBots) || 0),
    };

    try {
      NekoNexusService.Instance.SocketHost?.SendToGameServers(WebSocketPacketType.SetBotsConfig, this.current);
    } catch {
      // Best-effort: persisted value still applies on the next Game-server connect.
    }
  }

  /** Push the cached config to a single Game server (called right after it connects). */
  pushTo(guid: string): void {
    try {
      NekoNexusService.Instance.SocketHost?.SendToGameServer(guid, WebSocketPacketType.SetBotsConfig, this.current);
    } catch {
      /* best-effort */
    }
  }
}

const BotsConfigManager = new BotsConfigManagerImpl();
export default BotsConfigManager;
