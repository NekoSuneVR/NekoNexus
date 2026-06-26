import models from '@festivaldev/nekonexus-models';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
// Dashboard HTML is embedded at build time so the compiled exe is self-contained.
import dashboardHtml from './dashboard.html' with { type: 'text' };
import storeHtml from './store.html' with { type: 'text' };
import homepageHtml from './homepage.html' with { type: 'text' };
import leaderboardHtml from './leaderboard.html' with { type: 'text' };
import profileHtml from './profile.html' with { type: 'text' };
import streamsHtml from './streams.html' with { type: 'text' };
import loginHtml from './login.html' with { type: 'text' };
import { bearer, signToken, verifyToken } from './auth';
import { loadConfig } from './config';
import { initDatabase, sequelize } from './db';
import { createCheckout, loadNekoPay, parseWebhook } from './nekopay';
import { applyTheme } from './theme';
import { beginSteamLogin, verifySteamReturn } from './steam';
import { getUberStrikeStreams } from './twitch';

const cfg = loadConfig();
const nekopay = loadNekoPay();
await initDatabase(cfg);

let orderSeq = Date.now();
function newExternalId() {
  return `pdx_${(orderSeq++).toString(36)}_${Math.floor(performance.now()).toString(36)}`;
}

// Reads the XP curve straight from the DB (the model getter double-parses, so we go raw).
async function readXpTable(): Promise<Record<string, number>> {
  try {
    const [rows]: any = await sequelize.query('SELECT XpRequiredPerLevel FROM ApplicationConfiguration LIMIT 1');
    let t = rows?.[0]?.XpRequiredPerLevel;
    if (typeof t === 'string') t = JSON.parse(t);
    return t && typeof t === 'object' ? t : {};
  } catch {
    return {};
  }
}
async function xpForLevel(level: number): Promise<number | undefined> {
  const t = await readXpTable();
  const v = Number(t?.[level] ?? t?.[String(level)]);
  return Number.isFinite(v) ? v : undefined;
}

// Grant credits to a player's wallet exactly once for a completed order.
async function fulfilOrder(order: any) {
  if (order.Fulfilled || order.Status !== 'completed') return;
  const wallet = await models.MemberWallet.findByPk(order.Cmid);
  if (wallet) await wallet.increment('Credits', { by: order.Credits });
  await order.update({ Fulfilled: true });
  // Live-refresh the buyer's in-game credits if they're online.
  await pushWallet(order.Cmid);
}

// Best-effort realtime wallet push: if the player is online and the ws bridge is configured, tell
// their lobby client to refresh credits/coins live (no relog). The DB is always the source of truth;
// this only changes *when* the new balance shows. Safe no-op when offline or the bridge is off.
async function pushWallet(cmid: number): Promise<void> {
  if (!cfg.internalApiKey) return;
  try {
    const online = await models.ActivePlayer.findOne({ where: { Cmid: cmid }, raw: true }).catch(() => null);
    if (!online) return;
    const wallet: any = await models.MemberWallet.findByPk(cmid, { raw: true }).catch(() => null);
    if (!wallet) return;
    await fetch(`${cfg.wsInternalUrl}/internal/notify-wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Key': cfg.internalApiKey },
      body: JSON.stringify({
        entries: [{ cmid, credits: Number(wallet.Credits) || 0, points: Number(wallet.Points) || 0 }],
      }),
    }).catch(() => {});
  } catch {
    /* realtime is best-effort */
  }
}

// The global boost lives in its own single-row table the admin owns (created lazily on first use),
// mirroring how wallet writes work: persist here, then best-effort nudge the ws to broadcast it live.
let boostTableReady = false;
async function ensureBoostTable(): Promise<void> {
  if (boostTableReady) return;
  await sequelize.query(
    'CREATE TABLE IF NOT EXISTS GlobalBoost (Id INT PRIMARY KEY, PointsMultiplier INT NOT NULL DEFAULT 1, XpMultiplier INT NOT NULL DEFAULT 1, EndsAt BIGINT NOT NULL DEFAULT 0)',
  );
  await sequelize.query('INSERT IGNORE INTO GlobalBoost (Id, PointsMultiplier, XpMultiplier, EndsAt) VALUES (1, 1, 1, 0)');
  boostTableReady = true;
}

const ONLINE_WINDOW_MS = 60_000; // a server is "online" if it pinged within the last minute

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

// Admin tokens carry { sub, name }; user (Steam) tokens carry { kind:'user', cmid, name }. Keep them
// separate so a player's site session can never be used as an admin credential.
function requireAuth(req: Request): any | null {
  const payload = verifyToken(bearer(req), cfg.jwtSecret);
  if (!payload || payload.kind === 'user') return null;
  return payload;
}

function requireUser(req: Request): any | null {
  const payload = verifyToken(bearer(req), cfg.jwtSecret);
  if (!payload || payload.kind !== 'user') return null;
  return payload;
}

function isOnline(lastResponse: Date | null | undefined): boolean {
  return !!lastResponse && Date.now() - new Date(lastResponse).getTime() < ONLINE_WINDOW_MS;
}

async function handleApi(req: Request, url: URL): Promise<Response> {
  const { pathname } = url;
  const method = req.method;

  // ---- auth ----
  if (pathname === '/api/login' && method === 'POST') {
    const { username, password } = await req.json().catch(() => ({}));
    const user = await models.AdminUser.findOne({ where: { Username: username } });
    if (!user || !(await bcrypt.compare(String(password ?? ''), user.PasswordHash))) {
      return json({ error: 'Invalid username or password' }, 401);
    }
    await user.update({ LastLogin: new Date() });
    return json({
      token: signToken({ sub: user.Id, name: user.Username }, cfg.jwtSecret),
      username: user.Username,
      // Still on the factory admin/admin? The UI forces a change-credentials prompt.
      mustChangeCredentials: username === 'admin' && password === 'admin',
    });
  }

  // ---- PUBLIC homepage data (no auth) ----
  if (pathname === '/api/public/summary' && method === 'GET') {
    const servers = await models.PhotonServer.findAll({ raw: true, order: [['PhotonId', 'ASC']] });
    const totalPlayers = await models.PublicProfile.count({ where: { Cmid: { [Op.ne]: 0 } } }).catch(() => 0);
    const activePlayers = await models.ActivePlayer.count().catch(() => 0);
    return json({
      totalPlayers,
      activePlayers,
      serversTotal: servers.length,
      serversOnline: servers.filter((s: any) => isOnline(s.LastResponseTime)).length,
      servers: (servers as any[]).map((s) => ({ Name: s.Name, Region: s.Region, Online: isOnline(s.LastResponseTime) })),
    });
  }

  if (pathname === '/api/public/leaderboard' && method === 'GET') {
    const sortField = ({ xp: 'Xp', level: 'Level', splats: 'Splats', points: 'Points' } as Record<string, string>)[
      url.searchParams.get('sort') ?? 'xp'
    ] ?? 'Xp';
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 25) || 25, 100);
    const staff = await models.PublicProfile.findAll({ where: { [Op.or]: [{ AccessLevel: { [Op.gte]: 4 } }, { Cmid: 0 }] }, attributes: ['Cmid'], raw: true });
    const hidden = (staff as any[]).map((s) => s.Cmid);
    const top = await models.PlayerStatistics.findAll({
      where: hidden.length ? { Cmid: { [Op.notIn]: hidden } } : {},
      order: [[sortField, 'DESC']],
      limit: limit + 35,
      raw: true,
    });
    const names = await models.PublicProfile.findAll({ where: { Cmid: { [Op.in]: (top as any[]).map((t) => t.Cmid) } }, raw: true });
    const nameMap = new Map((names as any[]).map((n) => [n.Cmid, (n.Name ?? '').trim()]));
    return json(
      (top as any[])
        .filter((t) => (nameMap.get(t.Cmid) ?? '') !== '')
        .slice(0, limit)
        .map((t, i) => ({ rank: i + 1, Cmid: t.Cmid, Name: nameMap.get(t.Cmid), Level: t.Level, Xp: t.Xp, Splats: t.Splats, Points: t.Points })),
    );
  }

  // Public player profile (name, level, combat stats, clan). Used by the /profile/:cmid page.
  if (pathname.startsWith('/api/public/profile/') && method === 'GET') {
    const cmid = Number(pathname.split('/').pop());
    if (!Number.isFinite(cmid)) return json({ error: 'Bad id' }, 400);
    const profile = await models.PublicProfile.findByPk(cmid, { raw: true });
    if (!profile || (profile as any).Cmid === 0) return json({ error: 'Not found' }, 404);
    const stats: any = (await models.PlayerStatistics.findByPk(cmid, { raw: true })) ?? {};
    const member: any = await models.ClanMember.findByPk(cmid, { raw: true });
    let clan: any = null;
    if (member) {
      const c: any = await models.Clan.findByPk(member.GroupId, { raw: true });
      if (c) clan = { Name: c.Name, Tag: c.Tag, GroupId: c.GroupId };
    }
    return json({
      Cmid: (profile as any).Cmid,
      Name: (profile as any).Name,
      Level: stats.Level ?? 0,
      Xp: stats.Xp ?? 0,
      Points: stats.Points ?? 0,
      Splats: stats.Splats ?? 0,
      Splatted: stats.Splatted ?? 0,
      Headshots: stats.Headshots ?? 0,
      Nutshots: stats.Nutshots ?? 0,
      Shots: Number(stats.Shots ?? 0),
      Hits: Number(stats.Hits ?? 0),
      TimeSpentInGame: stats.TimeSpentInGame ?? 0,
      Clan: clan,
    });
  }

  // Public clan leaderboard: clans ranked by combined member kills (with member count + tag).
  if (pathname === '/api/public/clans' && method === 'GET') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 25) || 25, 100);
    const clans = await models.Clan.findAll({ raw: true });
    const members = await models.ClanMember.findAll({ attributes: ['Cmid', 'GroupId'], raw: true });
    const byGroup = new Map<number, number[]>();
    for (const m of members as any[]) {
      if (!byGroup.has(m.GroupId)) byGroup.set(m.GroupId, []);
      byGroup.get(m.GroupId)!.push(m.Cmid);
    }
    const allCmids = (members as any[]).map((m) => m.Cmid);
    const stats = allCmids.length
      ? await models.PlayerStatistics.findAll({ where: { Cmid: { [Op.in]: allCmids } }, attributes: ['Cmid', 'Splats'], raw: true })
      : [];
    const killsByCmid = new Map((stats as any[]).map((s) => [s.Cmid, s.Splats ?? 0]));
    const ranked = (clans as any[])
      .map((c) => {
        const cmids = byGroup.get(c.GroupId) ?? [];
        const kills = cmids.reduce((sum, id) => sum + (killsByCmid.get(id) ?? 0), 0);
        return { Name: c.Name, Tag: c.Tag, GroupId: c.GroupId, Members: cmids.length, Kills: kills };
      })
      .sort((a, b) => b.Kills - a.Kills || b.Members - a.Members)
      .slice(0, limit);
    return json(ranked);
  }

  // Public Twitch streams playing UberStrike.
  if (pathname === '/api/public/streams' && method === 'GET') {
    if (!cfg.twitchClientId || !cfg.twitchClientSecret) return json({ configured: false, streams: [] });
    const streams = await getUberStrikeStreams(cfg.twitchClientId, cfg.twitchClientSecret);
    return json({ configured: true, streams });
  }

  // A signed-in (Steam) user reports another player.
  if (pathname === '/api/public/report' && method === 'POST') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in with Steam first.' }, 401);
    const { targetCmid, reason, details } = await req.json().catch(() => ({}));
    const tCmid = Number(targetCmid);
    if (!Number.isFinite(tCmid) || tCmid <= 0) return json({ error: 'Invalid target.' }, 400);
    if (tCmid === user.cmid) return json({ error: "You can't report yourself." }, 400);
    const target: any = await models.PublicProfile.findByPk(tCmid, { raw: true });
    if (!target) return json({ error: 'Player not found.' }, 404);
    // Light rate-limit: cap open reports from one reporter against one target.
    const existing = await models.PlayerReport.count({ where: { ReporterCmid: user.cmid, TargetCmid: tCmid, Status: 'open' } });
    if (existing >= 3) return json({ error: 'You already have reports pending for this player.' }, 429);
    await models.PlayerReport.create({
      ReporterCmid: user.cmid,
      ReporterName: user.name ?? String(user.cmid),
      TargetCmid: tCmid,
      TargetName: target.Name,
      Reason: ['cheating', 'abuse', 'name', 'other'].includes(reason) ? reason : 'other',
      Details: String(details ?? '').slice(0, 1000),
      Status: 'open',
    });
    return json({ ok: true });
  }

  // ---- Steam OpenID login for normal users (admins keep username/password) ----
  if (pathname === '/api/auth/steam/login' && method === 'GET') {
    const realm = cfg.publicBaseUrl;
    const returnTo = `${cfg.publicBaseUrl}/api/auth/steam/return`;
    return Response.redirect(beginSteamLogin(realm, returnTo), 302);
  }

  if (pathname === '/api/auth/steam/return' && method === 'GET') {
    const steamId = await verifySteamReturn(url.searchParams);
    if (!steamId) return Response.redirect(`${cfg.publicBaseUrl}/login?error=verification%20failed`, 302);
    const member: any = await models.SteamMember.findByPk(steamId, { raw: true }).catch(() => null);
    if (!member) {
      return Response.redirect(`${cfg.publicBaseUrl}/login?error=No%20NekoNexus%20account%20for%20this%20Steam%20user%20-%20play%20once%20first`, 302);
    }
    const profile: any = await models.PublicProfile.findByPk(member.Cmid, { raw: true }).catch(() => null);
    const token = signToken({ kind: 'user', cmid: member.Cmid, name: profile?.Name ?? '', steamId }, cfg.jwtSecret);
    return Response.redirect(`${cfg.publicBaseUrl}/login?token=${encodeURIComponent(token)}`, 302);
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Not signed in' }, 401);
    return json({ cmid: user.cmid, name: user.name });
  }

  // ---- PUBLIC store endpoints (no admin auth: players + NekoPay call these) ----

  // List packages a player can buy.
  if (pathname === '/api/store/packages' && method === 'GET') {
    const pkgs = await models.CreditPackage.findAll({ where: { Enabled: true }, order: [['PriceCents', 'ASC']], raw: true });
    return json(pkgs);
  }

  // Start a purchase: create an order + a NekoPay checkout session, return the checkout URL.
  if (pathname === '/api/store/buy' && method === 'POST') {
    const { cmid, packageId } = await req.json().catch(() => ({}));
    const pkg = await models.CreditPackage.findByPk(Number(packageId));
    if (!pkg || !pkg.Enabled) return json({ error: 'Package not available' }, 404);
    const player = await models.PublicProfile.findByPk(Number(cmid));
    if (!player) return json({ error: 'Unknown player CMID' }, 404);

    const externalId = newExternalId();
    const order = await models.PaymentOrder.create({
      ExternalId: externalId, Cmid: Number(cmid), Credits: pkg.Credits, PriceCents: pkg.PriceCents, Currency: pkg.Currency, Status: 'created', Fulfilled: false,
    } as any);

    const result = await createCheckout(nekopay, {
      itemName: `${pkg.Name} (${pkg.Credits} credits)`,
      amountCents: pkg.PriceCents,
      currency: pkg.Currency,
      externalId,
      metadata: { cmid: Number(cmid), credits: pkg.Credits, packageId: pkg.Id },
    });
    if (!result.ok) { await order.update({ Status: 'failed' }); return json({ error: result.error }, 502); }
    await order.update({ SessionId: result.sessionId ?? null, Status: 'pending' });
    return json({ checkoutUrl: result.checkoutUrl, externalId });
  }

  // NekoPay -> us. Grants credits on completion (idempotent).
  if (pathname === '/api/webhooks/nekopay' && method === 'POST') {
    const payload = await req.json().catch(() => ({}));
    const { event, externalId, sessionId, status } = parseWebhook(payload);
    const order = externalId
      ? await models.PaymentOrder.findOne({ where: { ExternalId: externalId } })
      : sessionId
        ? await models.PaymentOrder.findOne({ where: { SessionId: sessionId } })
        : null;
    if (!order) return json({ ok: true, note: 'no matching order' });

    const isComplete = event === 'checkout.completed' || status === 'completed' || status === 'paid';
    const isFail = event === 'checkout.failed' || event === 'checkout.cancelled' || status === 'failed' || status === 'cancelled';
    if (isComplete) { await order.update({ Status: 'completed' }); await fulfilOrder(order); }
    else if (isFail) { await order.update({ Status: status || 'failed' }); }
    else { await order.update({ Status: status || event || order.Status }); }
    return json({ ok: true });
  }

  const auth = requireAuth(req);
  if (!auth) return json({ error: 'Unauthorized' }, 401);

  if (pathname === '/api/me' && method === 'GET') {
    return json({ username: auth.name });
  }

  // ---- System mail: broadcast a message from "System" to every player's in-game mailbox ----
  // Players see it from "System" and cannot reply (the web service rejects messages to Cmid 0).
  if (pathname === '/api/mail/broadcast' && method === 'POST') {
    const { message } = await req.json().catch(() => ({}));
    const text = String(message ?? '').trim();
    if (!text) return json({ error: 'Message is required' }, 400);

    const players = await models.PublicProfile.findAll({
      where: { Cmid: { [Op.ne]: 0 } },
      attributes: ['Cmid'],
      raw: true,
    });
    const now = new Date();
    const rows = (players as any[]).map((p) => ({
      PrivateMessageId: Math.floor(Math.random() * 2147483647) + 1,
      FromCmid: 0,
      FromName: 'System',
      ToCmid: p.Cmid,
      DateSent: now,
      ContentText: text,
      IsRead: false,
      IsDeletedBySender: false,
      IsDeletedByReceiver: false,
    }));
    if (rows.length) await models.PrivateMessage.bulkCreate(rows as any[]);

    // Realtime: nudge currently-online recipients so the announcement lands in their mailbox
    // instantly instead of on the next manual refresh. Best-effort; the mail is already saved.
    if (cfg.internalApiKey && rows.length) {
      try {
        const online = new Set(
          (
            (await models.ActivePlayer.findAll({ attributes: ['Cmid'], raw: true }).catch(() => [])) as any[]
          ).map((p) => p.Cmid),
        );
        const entries = rows
          .filter((r) => online.has(r.ToCmid))
          .map((r) => ({ cmid: r.ToCmid, messageId: r.PrivateMessageId }));
        if (entries.length) {
          await fetch(`${cfg.wsInternalUrl}/internal/notify-inbox`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Internal-Key': cfg.internalApiKey },
            body: JSON.stringify({ entries }),
          }).catch(() => {});
        }
      } catch {
        /* realtime is best-effort */
      }
    }

    return json({ ok: true, sent: rows.length });
  }

  // ---- account (change username / password) ----
  if (pathname === '/api/account' && method === 'POST') {
    const { username, currentPassword, newPassword } = await req.json().catch(() => ({}));
    const user = await models.AdminUser.findByPk(auth.sub);
    if (!user) return json({ error: 'Account not found' }, 404);
    if (!(await bcrypt.compare(String(currentPassword ?? ''), user.PasswordHash))) {
      return json({ error: 'Current password is incorrect' }, 403);
    }
    const patch: any = {};
    if (username && username !== user.Username) patch.Username = username;
    if (newPassword) patch.PasswordHash = await bcrypt.hash(String(newPassword), 10);
    await user.update(patch);
    return json({ ok: true, username: user.Username, token: signToken({ sub: user.Id, name: user.Username }, cfg.jwtSecret) });
  }

  // ---- dashboard stats ----
  if (pathname === '/api/stats' && method === 'GET') {
    const servers = await models.PhotonServer.findAll({ raw: true });
    const players = await models.PublicProfile.count().catch(() => 0);
    const activePlayers = await models.ActivePlayer.count().catch(() => 0);
    return json({
      totalPlayers: players,
      activePlayers,
      servers: servers.length,
      serversOnline: servers.filter((s: any) => isOnline(s.LastResponseTime)).length,
    });
  }

  // ---- servers ----
  if (pathname === '/api/servers' && method === 'GET') {
    const servers = await models.PhotonServer.findAll({ raw: true, order: [['PhotonId', 'ASC']] });
    return json(
      servers.map((s: any) => ({
        PhotonId: s.PhotonId,
        Name: s.Name,
        IP: s.IP,
        Port: s.Port,
        UsageType: s.UsageType, // 6 = Comm, 1 = Game
        Region: s.Region,
        Enabled: s.Enabled !== false,
        Online: isOnline(s.LastResponseTime),
        LastResponseTime: s.LastResponseTime,
      })),
    );
  }

  if (pathname === '/api/servers' && method === 'POST') {
    const b = await req.json().catch(() => ({}));
    if (b.PhotonId === undefined || b.PhotonId === null) return json({ error: 'PhotonId is required' }, 400);
    const values = {
      PhotonId: Number(b.PhotonId),
      Name: String(b.Name ?? 'Server'),
      IP: String(b.IP ?? '127.0.0.1'),
      Port: Number(b.Port ?? 5055),
      UsageType: Number(b.UsageType ?? 6),
      Region: Number(b.Region ?? 1),
      Enabled: b.Enabled !== false,
    };
    const existing = await models.PhotonServer.findByPk(values.PhotonId);
    if (existing) await existing.update(values);
    else await models.PhotonServer.create(values as any);
    return json({ ok: true });
  }

  const toggleMatch = pathname.match(/^\/api\/servers\/(\d+)\/toggle$/);
  if (toggleMatch && method === 'POST') {
    const server = await models.PhotonServer.findByPk(Number(toggleMatch[1]));
    if (!server) return json({ error: 'Server not found' }, 404);
    await server.update({ Enabled: !(server.Enabled !== false) });
    return json({ ok: true, Enabled: server.Enabled });
  }

  const delMatch = pathname.match(/^\/api\/servers\/(\d+)$/);
  if (delMatch && method === 'DELETE') {
    await models.PhotonServer.destroy({ where: { PhotonId: Number(delMatch[1]) } });
    return json({ ok: true });
  }

  // ---- region detection from IP (UsEast0 EuWest1 AsiaPacific2 UsWest3 SouthKorea4 Japan5) ----
  if (pathname === '/api/geo' && method === 'GET') {
    const ip = (url.searchParams.get('ip') ?? '').trim();
    try {
      const r = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,countryCode,continentCode,lon`);
      const g: any = await r.json();
      if (g.status !== 'success') return json({ region: null, note: 'Could not geolocate (private/local IP?)' });
      let region = 0;
      if (g.countryCode === 'JP') region = 5;
      else if (g.countryCode === 'KR') region = 4;
      else if (g.continentCode === 'AS' || g.continentCode === 'OC') region = 2;
      else if (g.continentCode === 'EU' || g.continentCode === 'AF') region = 1;
      else region = g.lon < -100 ? 3 : 0; // NA/SA: west vs east
      return json({ region, countryCode: g.countryCode });
    } catch {
      return json({ region: null });
    }
  }

  // ---- players ----
  const BANNED = 0x4; // ModerationFlag.Banned

  async function activeBan(cmid: number) {
    return models.ModerationAction.findOne({
      where: {
        ModerationFlag: BANNED,
        TargetCmid: cmid,
        [Op.or]: [{ ExpireTime: null as any }, { ExpireTime: { [Op.gt]: new Date() } }],
      },
      order: [['ActionDate', 'DESC']],
    });
  }

  if (pathname === '/api/players' && method === 'GET') {
    const q = (url.searchParams.get('q') ?? '').trim();
    const where: any = {};
    if (q) where[Op.or] = [{ Name: { [Op.like]: `%${q}%` } }, ...(/^\d+$/.test(q) ? [{ Cmid: Number(q) }] : [])];
    const players = await models.PublicProfile.findAll({ where, limit: 30, order: [['LastLoginDate', 'DESC']], raw: true });
    const bans = await models.ModerationAction.findAll({
      where: { ModerationFlag: BANNED, TargetCmid: { [Op.in]: players.map((p: any) => p.Cmid) }, [Op.or]: [{ ExpireTime: null as any }, { ExpireTime: { [Op.gt]: new Date() } }] },
      raw: true,
    });
    const bannedSet = new Set(bans.map((b: any) => b.TargetCmid));
    return json(players.map((p: any) => ({ Cmid: p.Cmid, Name: p.Name, AccessLevel: p.AccessLevel, LastLoginDate: p.LastLoginDate, Banned: bannedSet.has(p.Cmid) })));
  }

  const playerMatch = pathname.match(/^\/api\/players\/(\d+)$/);
  if (playerMatch && method === 'GET') {
    const cmid = Number(playerMatch[1]);
    const profile = await models.PublicProfile.findByPk(cmid, { raw: true });
    if (!profile) return json({ error: 'Player not found' }, 404);
    const [stats, wallet, ban, items] = await Promise.all([
      models.PlayerStatistics.findByPk(cmid, { raw: true }),
      models.MemberWallet.findByPk(cmid, { raw: true }),
      activeBan(cmid),
      models.PlayerInventoryItem.findAll({ where: { Cmid: cmid }, raw: true }).catch(() => []),
    ]);
    return json({ profile, stats, wallet, ban, itemCount: (items as any[]).length });
  }

  const actionMatch = pathname.match(/^\/api\/players\/(\d+)\/(ban|unban|stats|wallet|access|give-item)$/);
  if (actionMatch && method === 'POST') {
    const cmid = Number(actionMatch[1]);
    const action = actionMatch[2];
    const b = await req.json().catch(() => ({}));
    const profile = await models.PublicProfile.findByPk(cmid);
    if (!profile) return json({ error: 'Player not found' }, 404);

    if (action === 'ban') {
      const duration = Number(b.duration ?? 0); // minutes; 0 = permanent
      await models.ModerationAction.create({
        ModerationFlag: BANNED,
        SourceCmid: 0,
        SourceName: auth.name,
        TargetCmid: cmid,
        TargetName: profile.Name,
        ActionDate: new Date(),
        ExpireTime: duration > 0 ? new Date(Date.now() + duration * 60_000) : null,
        Reason: String(b.reason ?? 'Banned by admin'),
      } as any);
      return json({ ok: true });
    }
    if (action === 'unban') {
      await models.ModerationAction.update({ ExpireTime: new Date(0) }, { where: { ModerationFlag: BANNED, TargetCmid: cmid } });
      return json({ ok: true });
    }
    if (action === 'stats') {
      // Use raw SQL: the PlayerStatistics model has buggy getters on its JSON columns that
      // throw on null. The game derives Level from Xp (GetLevelForXp), so when an admin sets
      // Level we also set Xp to that level's threshold so the game keeps it.
      const sets: string[] = [];
      const repl: any[] = [];
      if (b.Level !== undefined) {
        sets.push('Level = ?'); repl.push(Number(b.Level));
        const threshold = await xpForLevel(Number(b.Level));
        if (threshold !== undefined) { sets.push('Xp = ?'); repl.push(threshold); }
      }
      if (b.Xp !== undefined && Number.isFinite(Number(b.Xp))) { sets.push('Xp = ?'); repl.push(Number(b.Xp)); }
      if (b.Points !== undefined) { sets.push('Points = ?'); repl.push(Number(b.Points)); }
      if (sets.length) { repl.push(cmid); await sequelize.query(`UPDATE PlayerStatistics SET ${sets.join(', ')} WHERE Cmid = ?`, { replacements: repl }); }
      return json({ ok: true });
    }
    if (action === 'wallet') {
      const sets: string[] = [];
      const repl: any[] = [];
      if (b.Credits !== undefined) { sets.push('Credits = ?'); repl.push(Number(b.Credits)); }
      if (b.Points !== undefined) { sets.push('Points = ?'); repl.push(Number(b.Points)); }
      if (sets.length) { repl.push(cmid); await sequelize.query(`UPDATE MemberWallets SET ${sets.join(', ')} WHERE Cmid = ?`, { replacements: repl }); }
      await pushWallet(cmid); // live-refresh if online
      return json({ ok: true });
    }
    if (action === 'access') {
      await profile.update({ AccessLevel: Number(b.AccessLevel ?? 0) });
      return json({ ok: true });
    }
    if (action === 'give-item') {
      const days = Number(b.days ?? 0);
      await models.PlayerInventoryItem.create({
        Cmid: cmid,
        ItemId: Number(b.ItemId),
        AmountRemaining: b.amount !== undefined ? Number(b.amount) : null,
        ExpirationDate: days > 0 ? new Date(Date.now() + days * 86_400_000) : null,
      } as any);
      return json({ ok: true });
    }
  }

  // ---- gift credits/coins to one or many players at once (additive; live if online) ----
  // Body: { cmids: number[], credits?: number, points?: number }. Amounts are ADDED to each
  // player's current balance ("gift 500 to these 3"), the wallet row is created if missing, and
  // every online recipient gets a live refresh so they don't have to restart the game.
  if (pathname === '/api/players/gift' && method === 'POST') {
    const b = await req.json().catch(() => ({}));
    const cmids = Array.isArray(b.cmids) ? [...new Set(b.cmids.map((c: any) => Number(c)).filter((c: number) => Number.isInteger(c) && c > 0))] : [];
    const credits = Math.trunc(Number(b.credits) || 0);
    const points = Math.trunc(Number(b.points) || 0);
    if (!cmids.length) return json({ error: 'Select at least one player' }, 400);
    if (!credits && !points) return json({ error: 'Enter a credit or coin amount' }, 400);

    const results: { cmid: number; ok: boolean }[] = [];
    for (const cmid of cmids as number[]) {
      try {
        const [wallet] = await models.MemberWallet.findOrCreate({ where: { Cmid: cmid }, defaults: { Cmid: cmid, Credits: 0, Points: 0 } as any });
        if (credits) await wallet.increment('Credits', { by: credits });
        if (points) await wallet.increment('Points', { by: points });
        await pushWallet(cmid); // live-refresh if online
        results.push({ cmid, ok: true });
      } catch {
        results.push({ cmid, ok: false });
      }
    }
    return json({ ok: true, granted: results.filter((r) => r.ok).length, credits, points, results });
  }

  // ---- global coin/xp boost event (2x/5x weekend) ----
  if (pathname === '/api/config/boost' && method === 'GET') {
    await ensureBoostTable();
    const [rows]: any = await sequelize.query('SELECT PointsMultiplier, XpMultiplier, EndsAt FROM GlobalBoost WHERE Id = 1');
    const r = rows?.[0] ?? {};
    const endsAt = Number(r.EndsAt) || 0;
    const active = (Number(r.PointsMultiplier) > 1 || Number(r.XpMultiplier) > 1) && (endsAt === 0 || Date.now() < endsAt);
    return json({
      pointsMultiplier: Number(r.PointsMultiplier) || 1,
      xpMultiplier: Number(r.XpMultiplier) || 1,
      endsAt,
      active,
    });
  }

  if (pathname === '/api/config/boost' && method === 'POST') {
    await ensureBoostTable();
    const b = await req.json().catch(() => ({}));
    const pointsMultiplier = Math.max(1, Math.min(100, Math.trunc(Number(b.pointsMultiplier) || 1)));
    // Default the XP boost to mirror the coin boost unless one is given explicitly.
    const xpMultiplier = Math.max(1, Math.min(100, Math.trunc(Number(b.xpMultiplier ?? b.pointsMultiplier) || 1)));
    const durationMinutes = Math.max(0, Math.trunc(Number(b.durationMinutes) || 0)); // 0 = until cleared
    const endsAt = durationMinutes > 0 ? Date.now() + durationMinutes * 60_000 : 0;

    await sequelize.query('UPDATE GlobalBoost SET PointsMultiplier = ?, XpMultiplier = ?, EndsAt = ? WHERE Id = 1', {
      replacements: [pointsMultiplier, xpMultiplier, endsAt],
    });

    // Push live to every Game server so the new multiplier applies to the very next match (no
    // realtime restart). Persisted above, so it still applies even if this nudge can't be delivered.
    let live = false;
    if (cfg.internalApiKey) {
      try {
        const resp = await fetch(`${cfg.wsInternalUrl}/internal/set-boost`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Internal-Key': cfg.internalApiKey },
          body: JSON.stringify({ pointsMultiplier, xpMultiplier, endsAt }),
        }).catch(() => null);
        live = !!resp?.ok;
      } catch {
        /* realtime is best-effort */
      }
    }
    return json({ ok: true, pointsMultiplier, xpMultiplier, endsAt, live });
  }

  // ---- items (searchable list for "give item": weapons, gear, quick, functional) ----
  if (pathname === '/api/items' && method === 'GET') {
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    const sources: [string, any][] = [
      ['Weapon', models.ShopWeaponItem],
      ['Gear', models.ShopGearItem],
      ['Quickuse', models.ShopQuickItem],
      ['Functional', models.ShopFunctionalItem],
    ];
    const out: any[] = [];
    for (const [type, model] of sources) {
      const rows = await model.findAll({ attributes: ['ID', 'Name'], raw: true }).catch(() => []);
      for (const r of rows as any[]) {
        if (!q || String(r.Name ?? '').toLowerCase().includes(q)) out.push({ ItemId: r.ID, Name: r.Name, Type: type });
      }
    }
    out.sort((a, b) => String(a.Name ?? '').localeCompare(String(b.Name ?? '')));
    return json(out.slice(0, 200));
  }

  // ---- set max player level (extends the XP table so levels above 100 work) ----
  if (pathname === '/api/config/max-level' && method === 'POST') {
    const { maxLevel } = await req.json().catch(() => ({}));
    const target = Math.max(2, Math.min(5000, Number(maxLevel) || 100));
    const xp = await readXpTable();
    // Find the highest existing level/xp and continue the curve smoothly (quadratic growth).
    let last = 0; for (const k of Object.keys(xp)) last = Math.max(last, Number(k));
    let prevXp = Number(xp[String(last)] ?? 0);
    let inc = last > 1 ? prevXp - Number(xp[String(last - 1)] ?? 0) : 800;
    for (let L = last + 1; L <= target; L++) { inc += 50; prevXp += inc; xp[String(L)] = prevXp; }
    const maxXp = Number(xp[String(target)] ?? 0);
    // Write back with a raw query so we don't trip the model's getter.
    await sequelize.query('UPDATE ApplicationConfiguration SET XpRequiredPerLevel = ?, MaxLevel = ?, MaxXp = ?', {
      replacements: [JSON.stringify(xp), target, maxXp],
    });
    return json({ ok: true, maxLevel: target, note: 'Restart the web service to apply.' });
  }

  // ---- moderation log (reports) ----
  if (pathname === '/api/moderation' && method === 'GET') {
    const log = await models.ModerationAction.findAll({ limit: 100, order: [['ActionDate', 'DESC']], raw: true });
    return json(log);
  }

  // ---- player reports (submitted by signed-in users) ----
  if (pathname === '/api/reports' && method === 'GET') {
    const status = url.searchParams.get('status');
    const reports = await models.PlayerReport.findAll({
      where: status ? { Status: status } : {},
      limit: 200,
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    return json(reports);
  }

  if (pathname.startsWith('/api/reports/') && pathname.endsWith('/status') && method === 'POST') {
    const id = Number(pathname.split('/')[3]);
    const { status } = await req.json().catch(() => ({}));
    if (!['open', 'reviewed', 'resolved', 'dismissed'].includes(status)) return json({ error: 'Bad status' }, 400);
    const report = await models.PlayerReport.findByPk(id);
    if (!report) return json({ error: 'Not found' }, 404);
    await report.update({ Status: status });
    return json({ ok: true });
  }

  // ---- leaderboard (staff: Moderator+ are hidden) ----
  if (pathname === '/api/leaderboard' && method === 'GET') {
    const sortMap: Record<string, string> = { xp: 'Xp', level: 'Level', points: 'Points', splats: 'Splats' };
    const sort = sortMap[url.searchParams.get('sort') ?? 'xp'] ?? 'Xp';
    // Hide staff accounts (AccessLevel >= Moderator = 4) and the root account from the board.
    const staff = await models.PublicProfile.findAll({ where: { [Op.or]: [{ AccessLevel: { [Op.gte]: 4 } }, { Cmid: 0 }] }, attributes: ['Cmid'], raw: true });
    const hidden = staff.map((s: any) => s.Cmid);
    const top = await models.PlayerStatistics.findAll({
      where: hidden.length ? { Cmid: { [Op.notIn]: hidden } } : {},
      order: [[sort, 'DESC']],
      limit: 100,
      raw: true,
    });
    const names = await models.PublicProfile.findAll({ where: { Cmid: { [Op.in]: top.map((t: any) => t.Cmid) } }, raw: true });
    const nameMap = new Map(names.map((n: any) => [n.Cmid, (n.Name ?? '').trim()]));
    // Only real, named players appear on the board (hides orphan stats rows + unnamed accounts).
    return json(
      top
        .filter((t: any) => (nameMap.get(t.Cmid) ?? '') !== '')
        .slice(0, 50)
        .map((t: any, i: number) => ({ rank: i + 1, Cmid: t.Cmid, Name: nameMap.get(t.Cmid), Level: t.Level, Xp: t.Xp, Points: t.Points, Splats: t.Splats })),
    );
  }

  // ---- store admin (packages, orders, free-items, payment status) ----
  if (pathname === '/api/store/admin/packages' && method === 'GET') {
    return json(await models.CreditPackage.findAll({ order: [['PriceCents', 'ASC']], raw: true }));
  }
  if (pathname === '/api/store/admin/packages' && method === 'POST') {
    const b = await req.json().catch(() => ({}));
    const values = { Name: String(b.Name ?? 'Credits'), Credits: Number(b.Credits ?? 0), PriceCents: Math.round(Number(b.PriceCents ?? 0)), Currency: String(b.Currency ?? 'USD'), Enabled: b.Enabled !== false };
    if (b.Id) { const p = await models.CreditPackage.findByPk(Number(b.Id)); if (p) await p.update(values); }
    else await models.CreditPackage.create(values as any);
    return json({ ok: true });
  }
  const pkgDel = pathname.match(/^\/api\/store\/admin\/packages\/(\d+)$/);
  if (pkgDel && method === 'DELETE') { await models.CreditPackage.destroy({ where: { Id: Number(pkgDel[1]) } }); return json({ ok: true }); }

  if (pathname === '/api/store/admin/orders' && method === 'GET') {
    return json(await models.PaymentOrder.findAll({ order: [['createdAt', 'DESC']], limit: 100, raw: true }));
  }

  // Free-items mode: set every shop item price to 0 (or restore is a re-seed). Returns count.
  if (pathname === '/api/store/admin/free-items' && method === 'POST') {
    const { free } = await req.json().catch(() => ({ free: true }));
    if (free) {
      const [a] = await models.ShopItemPrice.update({ Price: 0 } as any, { where: {} }).catch(() => [0]);
      return json({ ok: true, updated: a ?? 0, note: 'All shop item prices set to 0. Re-seed to restore original prices.' });
    }
    return json({ ok: false, note: 'Re-run the web service "seed" command to restore original prices.' });
  }

  if (pathname === '/api/store/admin/payment-status' && method === 'GET') {
    return json({
      configured: !!nekopay.secret,
      endpoint: nekopay.endpoint,
      publicBaseUrl: nekopay.publicBaseUrl,
      publicKey: nekopay.publicKey || null,
      webhookUrl: `${nekopay.publicBaseUrl}/api/webhooks/nekopay`,
    });
  }

  return json({ error: 'Not found' }, 404);
}

Bun.serve({
  port: cfg.port,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(req, url);
      } catch (e: any) {
        console.error('[api error]', url.pathname, e?.stack ?? e);
        return json({ error: e?.message ?? 'Server error' }, 500);
      }
    }
    // Serve an HTML page with the active event theme injected (none = unchanged).
    const page = (body: string) =>
      new Response(applyTheme(body, cfg.siteTheme), { headers: { 'content-type': 'text/html; charset=utf-8' } });

    // Public web store (opened by the in-game "Get Credits" button).
    if (url.pathname === '/store') {
      return page(storeHtml);
    }
    // Public site pages.
    if (url.pathname === '/leaderboard') return page(leaderboardHtml);
    if (url.pathname === '/streams') return page(streamsHtml);
    if (url.pathname === '/login') return page(loginHtml);
    if (url.pathname === '/profile' || url.pathname.startsWith('/profile/')) return page(profileHtml);
    // NekoPay return pages.
    if (url.pathname === '/pay/success' || url.pathname === '/pay/cancel') {
      const ok = url.pathname.endsWith('success');
      const msg = ok
        ? 'Payment received! Your credits will appear in-game after your next login or wallet refresh. You can close this tab.'
        : 'Payment cancelled. You can close this tab and try again from the game.';
      return new Response(
        `<!doctype html><meta charset="utf-8"><title>NekoNexus</title>` +
        `<body style="background:#0a0a0a;color:#e5e5e5;font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0">` +
        `<div style="max-width:28rem;text-align:center;padding:1.5rem">` +
        `<h1 style="color:${ok ? '#34d399' : '#f87171'}">${ok ? 'Thank you!' : 'Cancelled'}</h1><p>${msg}</p></div></body>`,
        { headers: { 'content-type': 'text/html; charset=utf-8' } },
      );
    }
    // Admin dashboard (login + SPA) under /admin.
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      return new Response(dashboardHtml, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    // Public homepage for everything else (/, etc.).
    return page(homepageHtml);
  },
});

// eslint-disable-next-line no-console
console.log(`[admin] NekoNexus Admin dashboard on http://localhost:${cfg.port}  (db ${cfg.db.host}:${cfg.db.port}/${cfg.db.database})`);
