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

import NekoNexusService from '@/NekoNexusService';
import { BoostManager, ChatBuffer, Log } from '@/utils';
import { RealtimeNotify } from '@/utils/RealtimeNotify';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import express, { type Express } from 'express';
import * as http from 'http';
import httpStatus from 'http-status';
import type { AddressInfo } from 'net';
import Routes, { ServiceVersions } from './routes';
import type BaseWebService from './routes/BaseWebService';

export default class WebServiceHost {
  readonly port: number;

  readonly expressApp: Express;
  private listener?: http.Server;

  constructor(port: number = 8080) {
    this.port = port;

    this.expressApp = express();
    this.expressApp.disable('x-powered-by');
    this.expressApp.disable('etag');
    this.expressApp.set('json spaces', 2);

    // if (process.env.NODE_ENV !== 'production') {
    //   this.expressApp.use(morgan(`[${chalk.blue('INFO')}] [WebServiceHost] [:date[iso]] :remote-addr ":method :url HTTP/:http-version" :status (:req[Content-Length]/:res[content-length] bytes)`));
    // }

    bodyParserXml(bodyParser);

    this.expressApp.use(express.urlencoded({ extended: true }));
    this.expressApp.use(bodyParser.xml());

    this.expressApp.use((req, res, next) => {
      res.set('X-Powered-By', 'Hamsterwheel/1.0');
      res.set('Server', 'Microsoft-HTTPAPI/2.0');

      return next();
    });

    // Internal realtime-notify endpoint (admin service -> ws). The admin writes mail / System
    // announcements straight to the DB but has no Comm-server bridge, so it calls this to make
    // online players' inboxes refresh in realtime. Gated by a shared secret (INTERNAL_API_KEY) so
    // it's inert unless configured and safe even if the port is exposed.
    this.expressApp.post('/internal/notify-inbox', express.json(), (req, res): void => {
      const key = process.env.INTERNAL_API_KEY;
      if (!key || req.get('X-Internal-Key') !== key) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }

      const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];
      // Fire-and-forget: realtime delivery must never block (or fail) the admin's response.
      void (async () => {
        for (const entry of entries) {
          const cmid = Number(entry?.cmid);
          const messageId = Number(entry?.messageId);
          if (Number.isFinite(cmid) && Number.isFinite(messageId)) {
            await RealtimeNotify.inboxMessage(cmid, messageId);
          }
        }
      })().catch(() => {});

      res.json({ ok: true, count: entries.length });
    });

    // Internal friend-requests push (admin -> ws). After a web friend request/accept, refresh the
    // target's in-game requests list. Same shared-secret gate.
    this.expressApp.post('/internal/notify-requests', express.json(), (req, res): void => {
      const key = process.env.INTERNAL_API_KEY;
      if (!key || req.get('X-Internal-Key') !== key) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }
      const cmids = Array.isArray(req.body?.cmids) ? req.body.cmids : [];
      void (async () => {
        for (const c of cmids) {
          const cmid = Number(c);
          if (Number.isFinite(cmid)) await RealtimeNotify.inboxRequests(cmid);
        }
      })().catch(() => {});
      res.json({ ok: true, count: cmids.length });
    });

    // Internal wallet-push endpoint (admin service -> ws). The admin writes the wallet straight to
    // the DB (gift credits/coins) but has no Comm-server bridge, so it calls this to make the online
    // player's credits/coins display update live. Same shared-secret gate as notify-inbox.
    this.expressApp.post('/internal/notify-wallet', express.json(), (req, res): void => {
      const key = process.env.INTERNAL_API_KEY;
      if (!key || req.get('X-Internal-Key') !== key) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }

      const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];
      void (async () => {
        for (const entry of entries) {
          const cmid = Number(entry?.cmid);
          const credits = Number(entry?.credits);
          const points = Number(entry?.points);
          if (Number.isFinite(cmid) && Number.isFinite(credits) && Number.isFinite(points)) {
            await RealtimeNotify.wallet(cmid, credits, points);
          }
        }
      })().catch(() => {});

      res.json({ ok: true, count: entries.length });
    });

    // Internal boost endpoint (admin service -> ws). The admin persists the global 2x/5x event to
    // the DB then calls this so the ws caches it and broadcasts it to every connected Game server
    // immediately (no realtime restart). Same shared-secret gate.
    this.expressApp.post('/internal/set-boost', express.json(), (req, res): void => {
      const key = process.env.INTERNAL_API_KEY;
      if (!key || req.get('X-Internal-Key') !== key) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }

      const points = Number(req.body?.pointsMultiplier);
      const xp = Number(req.body?.xpMultiplier);
      const endsAt = Number(req.body?.endsAt);
      if (!Number.isFinite(points) || !Number.isFinite(xp)) {
        res.status(400).json({ error: 'invalid multipliers' });
        return;
      }

      BoostManager.applyAndBroadcast(points, xp, Number.isFinite(endsAt) ? endsAt : 0);
      res.json({ ok: true });
    });

    // Internal stats-push endpoint (admin -> ws). Admin edits a player's level/xp/points straight
    // in the DB, then calls this to update their in-game level/xp/points live. Same shared-secret gate.
    this.expressApp.post('/internal/notify-stats', express.json(), (req, res): void => {
      const key = process.env.INTERNAL_API_KEY;
      if (!key || req.get('X-Internal-Key') !== key) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }

      const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];
      void (async () => {
        for (const entry of entries) {
          const cmid = Number(entry?.cmid);
          const xp = Number(entry?.xp);
          const points = Number(entry?.points);
          if (Number.isFinite(cmid) && Number.isFinite(xp) && Number.isFinite(points)) {
            await RealtimeNotify.stats(cmid, xp, points);
          }
        }
      })().catch(() => {});

      res.json({ ok: true, count: entries.length });
    });

    // Internal web-chat bridge (admin <-> ws). The website shares one chat stream with the in-game
    // global lobby: GET returns recent lobby chat the ws has buffered (in-game -> web); POST takes a
    // message a logged-in website user sent and broadcasts it into the lobby (web -> in-game) while
    // also buffering it so other website users see it. Same shared-secret gate.
    this.expressApp.get('/internal/chat', (req, res): void => {
      const key = process.env.INTERNAL_API_KEY;
      if (!key || req.get('X-Internal-Key') !== key) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }
      const since = Number(req.query?.since) || 0;
      res.json({ ok: true, lastId: ChatBuffer.lastId, messages: ChatBuffer.recent(since) });
    });

    this.expressApp.post('/internal/chat', express.json(), (req, res): void => {
      const key = process.env.INTERNAL_API_KEY;
      if (!key || req.get('X-Internal-Key') !== key) {
        res.status(403).json({ error: 'forbidden' });
        return;
      }
      const cmid = Number(req.body?.cmid);
      const name = String(req.body?.name ?? '').trim();
      const text = String(req.body?.text ?? '').trim().slice(0, 200);
      if (!Number.isFinite(cmid) || !name || !text) {
        res.status(400).json({ error: 'invalid message' });
        return;
      }
      // Buffer first (so the sender sees it immediately even if the lobby is empty), then broadcast.
      ChatBuffer.push(cmid, name, text);
      void RealtimeNotify.lobbyChat(cmid, name, text).catch(() => {});
      res.json({ ok: true, lastId: ChatBuffer.lastId });
    });

    this.expressApp.use(Routes);

    this.expressApp.use((req, res, next) => {
      res.status(httpStatus.NOT_FOUND)
        .send(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN""http://www.w3.org/TR/html4/strict.dtd">
<HTML>

<HEAD>
\t<TITLE>Not Found</TITLE>
\t<META HTTP-EQUIV="Content-Type" Content="text/html; charset=us-ascii">
</HEAD>

<BODY>
\t<h2>Not Found</h2>
\t<hr>
\t<p>HTTP Error 404. The requested resource is not found.</p>
</BODY>

</HTML>`);
    });
  }

  async start(): Promise<void> {
    Log.info('Starting Web Service server...');

    return new Promise((resolve, reject) => {
      this.listener = this.expressApp.listen(
        this.port,
        NekoNexusService.Instance.ServiceSettings.Hostname ?? '0.0.0.0',
        () => {
          for (const services of Object.values(ServiceVersions)) {
            for (const service of Object.values(services) as (typeof BaseWebService)[]) {
              Log.debug(`Initializing ${service.ServiceName} (${service.ServiceVersion})...`);
            }
          }

          const address: AddressInfo = this.listener?.address() as AddressInfo;
          Log.info(`Web Service server listening on ${address.address}:${address.port}.`);

          resolve();
        },
      );
    });
  }

  stop(): void {
    this.listener?.close();
    this.listener = undefined;
  }
}
