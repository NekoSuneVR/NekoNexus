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
import socialHtml from './social.html' with { type: 'text' };
import loginHtml from './login.html' with { type: 'text' };
import { bearer, signToken, verifyToken } from './auth';
import { loadConfig } from './config';
import { initDatabase, sequelize } from './db';
import { createCheckout, loadNekoPay, parseWebhook } from './nekopay';
import { applyTheme } from './theme';
import { beginSteamLogin, verifySteamReturn } from './steam';
import { getUberStrikeStreams } from './twitch';

// Shared auth-aware nav for the public pages. Each page puts <span id="authnav">…Sign in…</span> in
// its header and loads /assets/nav.js; when a user token is present this swaps the "Sign in" link for
// a profile dropdown (My profile / Settings / Sign out). Plain ES5 so it runs everywhere.
const NAV_JS = `(function () {
  var el = document.getElementById('authnav');
  if (!el) return;
  var token = localStorage.getItem('nekonexus_user_token');
  var me = null;
  if (token) { try { me = JSON.parse(atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/'))); } catch (e) {} }
  if (!me || !me.cmid) return;
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  var name = me.name || ('Player ' + me.cmid);
  el.innerHTML =
    '<div style="position:relative">'
    + '<button id="navUserBtn" class="flex items-center gap-2 hover:text-white">'
    + '<span class="inline-grid place-items-center w-7 h-7 rounded-full bg-brand-600/30 border border-brand-600 text-brand-400 text-xs font-bold">' + esc(name.charAt(0).toUpperCase()) + '</span>'
    + '<span>' + esc(name) + '</span><span class="text-xs opacity-70">&#9662;</span></button>'
    + '<div id="navUserMenu" class="hidden absolute right-0 mt-2 w-44 rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl py-1 text-sm z-50">'
    + '<a href="/profile/' + me.cmid + '" class="block px-3 py-2 hover:bg-neutral-800 text-neutral-200">My profile</a>'
    + '<a href="/social" class="block px-3 py-2 hover:bg-neutral-800 text-neutral-200">Friends &amp; Mail</a>'
    + '<a href="/login" class="block px-3 py-2 hover:bg-neutral-800 text-neutral-200">Settings</a>'
    + '<button id="navSignOut" class="block w-full text-left px-3 py-2 hover:bg-neutral-800 text-red-400">Sign out</button>'
    + '</div></div>';
  var btn = document.getElementById('navUserBtn'), menu = document.getElementById('navUserMenu');
  btn.addEventListener('click', function (e) { e.stopPropagation(); menu.classList.toggle('hidden'); });
  document.addEventListener('click', function () { menu.classList.add('hidden'); });
  document.getElementById('navSignOut').addEventListener('click', function () {
    localStorage.removeItem('nekonexus_user_token'); location.href = '/';
  });
})();`;

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

// Best-effort realtime stats push: after an admin edits level/xp/points, tell the online player's
// lobby client to update its level/xp/points live (no relog).
async function pushStats(cmid: number): Promise<void> {
  if (!cfg.internalApiKey) return;
  try {
    const online = await models.ActivePlayer.findOne({ where: { Cmid: cmid }, raw: true }).catch(() => null);
    if (!online) return;
    const [rows]: any = await sequelize.query('SELECT Xp, Points FROM PlayerStatistics WHERE Cmid = ?', { replacements: [cmid] });
    const s = rows?.[0];
    if (!s) return;
    await fetch(`${cfg.wsInternalUrl}/internal/notify-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Key': cfg.internalApiKey },
      body: JSON.stringify({ entries: [{ cmid, xp: Number(s.Xp) || 0, points: Number(s.Points) || 0 }] }),
    }).catch(() => {});
  } catch {
    /* realtime is best-effort */
  }
}

// Nudge an online recipient's in-game inbox to pull a new mail immediately (web -> in-game sync).
async function notifyInboxMsg(cmid: number, messageId: number): Promise<void> {
  if (!cfg.internalApiKey) return;
  try {
    const online = await models.ActivePlayer.findOne({ where: { Cmid: cmid }, raw: true }).catch(() => null);
    if (!online) return;
    await fetch(`${cfg.wsInternalUrl}/internal/notify-inbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Key': cfg.internalApiKey },
      body: JSON.stringify({ entries: [{ cmid, messageId }] }),
    }).catch(() => {});
  } catch {
    /* realtime is best-effort */
  }
}

// Nudge a player's in-game friend-requests list to refresh (web friend request/accept).
async function notifyFriendRequests(cmid: number): Promise<void> {
  if (!cfg.internalApiKey) return;
  try {
    await fetch(`${cfg.wsInternalUrl}/internal/notify-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Internal-Key': cfg.internalApiKey },
      body: JSON.stringify({ cmids: [cmid] }),
    }).catch(() => {});
  } catch {
    /* realtime is best-effort */
  }
}

const newMsgId = () => Math.floor(Math.random() * 2147483647) + 1;

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

// Post an in-game mail from "System Staff" (Cmid 0) to the given players, and nudge any who are
// online so it lands instantly. Used for gift/boost announcements. Best-effort: never throws.
async function postSystemMail(cmids: number[], text: string): Promise<void> {
  const targets = [...new Set(cmids.map((c) => Number(c)).filter((c) => Number.isInteger(c) && c > 0))];
  if (!targets.length || !text.trim()) return;
  const now = new Date();
  const rows = targets.map((cmid) => ({
    PrivateMessageId: Math.floor(Math.random() * 2147483647) + 1,
    FromCmid: 0,
    FromName: 'System Staff',
    ToCmid: cmid,
    DateSent: now,
    ContentText: text,
    IsRead: false,
    IsDeletedBySender: false,
    IsDeletedByReceiver: false,
  }));
  try {
    await models.PrivateMessage.bulkCreate(rows as any[]);
  } catch {
    return;
  }
  if (!cfg.internalApiKey) return;
  try {
    const online = new Set(
      ((await models.ActivePlayer.findAll({ attributes: ['Cmid'], raw: true }).catch(() => [])) as any[]).map(
        (p) => p.Cmid,
      ),
    );
    const entries = rows.filter((r) => online.has(r.ToCmid)).map((r) => ({ cmid: r.ToCmid, messageId: r.PrivateMessageId }));
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

const ONLINE_WINDOW_MS = 60_000; // a server is "online" if it pinged within the last minute

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

// Open API responses: same as json() but CORS-enabled so third-party sites/tools can read them.
const CORS_HEADERS = {
  'content-type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'Content-Type',
  'cache-control': 'public, max-age=15',
};
function apiJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

// The game stores PlayerStatistics.WeaponStatistics / PersonalRecord as DOUBLE-encoded JSON
// (a JSON string of a JSON string). Parse defensively up to a couple of times until it's an object.
function parseStatJson(val: any): Record<string, any> {
  let v = val;
  for (let i = 0; i < 3 && typeof v === 'string'; i++) {
    try {
      v = JSON.parse(v);
    } catch {
      return {};
    }
  }
  return v && typeof v === 'object' ? v : {};
}

// Turn the flat WeaponStatistics blob into a tidy per-weapon array with accuracy.
const WEAPON_KEYS = ['Handgun', 'MachineGun', 'Shotgun', 'Splattergun', 'Sniper', 'Melee', 'Cannon', 'Launcher'];
function weaponStatsFrom(raw: any): any[] {
  const w = parseStatJson(raw);
  return WEAPON_KEYS.map((name) => {
    const fired = Number(w[`${name}TotalShotsFired`] ?? 0);
    const hit = Number(w[`${name}TotalShotsHit`] ?? 0);
    return {
      Weapon: name,
      Splats: Number(w[`${name}TotalSplats`] ?? 0),
      DamageDone: Number(w[`${name}TotalDamageDone`] ?? 0),
      ShotsFired: fired,
      ShotsHit: hit,
      Accuracy: fired > 0 ? Math.round((hit / fired) * 1000) / 10 : 0, // % to 1dp
    };
  });
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

// Full public player profile (used by /api/public/profile and the Open API). Returns null for
// unknown players or the Cmid 0 system account.
async function buildPlayerProfile(cmid: number): Promise<any | null> {
  if (!Number.isFinite(cmid)) return null;
  const profile: any = await models.PublicProfile.findByPk(cmid, { raw: true });
  if (!profile || profile.Cmid === 0) return null;
  const stats: any = (await models.PlayerStatistics.findByPk(cmid, { raw: true })) ?? {};
  const member: any = await models.ClanMember.findByPk(cmid, { raw: true }).catch(() => null);
  let clan: any = null;
  if (member) {
    const c: any = await models.Clan.findByPk(member.GroupId, { raw: true }).catch(() => null);
    if (c) clan = { GroupId: c.GroupId, Name: c.Name, Tag: c.Tag };
  }
  const shots = Number(stats.Shots ?? 0);
  const hits = Number(stats.Hits ?? 0);
  const splats = Number(stats.Splats ?? 0);
  const splatted = Number(stats.Splatted ?? 0);
  return {
    Cmid: profile.Cmid,
    Name: profile.Name,
    AccessLevel: profile.AccessLevel ?? 0,
    Level: stats.Level ?? 0,
    Xp: stats.Xp ?? 0,
    Points: stats.Points ?? 0,
    Splats: splats,
    Splatted: splatted,
    KDR: splatted > 0 ? Math.round((splats / splatted) * 100) / 100 : splats,
    Headshots: stats.Headshots ?? 0,
    Nutshots: stats.Nutshots ?? 0,
    Shots: shots,
    Hits: hits,
    Accuracy: shots > 0 ? Math.round((hits / shots) * 1000) / 10 : 0,
    TimeSpentInGame: stats.TimeSpentInGame ?? 0, // seconds
    WeaponStats: weaponStatsFrom(stats.WeaponStatistics),
    PersonalRecord: parseStatJson(stats.PersonalRecord),
    Clan: clan,
  };
}

// Clans ranked by combined member kills (+ member count + tag).
async function buildClanList(limit: number): Promise<any[]> {
  const clans = (await models.Clan.findAll({ raw: true })) as any[];
  const members = (await models.ClanMember.findAll({ attributes: ['Cmid', 'GroupId'], raw: true })) as any[];
  const byGroup = new Map<number, number[]>();
  for (const m of members) {
    if (!byGroup.has(m.GroupId)) byGroup.set(m.GroupId, []);
    byGroup.get(m.GroupId)!.push(m.Cmid);
  }
  const allCmids = members.map((m) => m.Cmid);
  const stats = allCmids.length
    ? ((await models.PlayerStatistics.findAll({ where: { Cmid: { [Op.in]: allCmids } }, attributes: ['Cmid', 'Splats'], raw: true })) as any[])
    : [];
  const killsByCmid = new Map(stats.map((s) => [s.Cmid, s.Splats ?? 0]));
  return clans
    .map((c) => {
      const cmids = byGroup.get(c.GroupId) ?? [];
      return {
        GroupId: c.GroupId,
        Name: c.Name,
        Tag: c.Tag,
        Members: cmids.length,
        Kills: cmids.reduce((sum, id) => sum + (killsByCmid.get(id) ?? 0), 0),
      };
    })
    .sort((a, b) => b.Kills - a.Kills || b.Members - a.Members)
    .slice(0, limit);
}

// One clan with its member roster (name, level, kills).
async function buildClanDetail(groupId: number): Promise<any | null> {
  const clan: any = await models.Clan.findByPk(groupId, { raw: true });
  if (!clan) return null;
  const members = (await models.ClanMember.findAll({ where: { GroupId: groupId }, raw: true })) as any[];
  const cmids = members.map((m) => m.Cmid);
  const profiles = cmids.length
    ? ((await models.PublicProfile.findAll({ where: { Cmid: { [Op.in]: cmids } }, attributes: ['Cmid', 'Name'], raw: true })) as any[])
    : [];
  const stats = cmids.length
    ? ((await models.PlayerStatistics.findAll({ where: { Cmid: { [Op.in]: cmids } }, attributes: ['Cmid', 'Splats', 'Level', 'Xp'], raw: true })) as any[])
    : [];
  const nameBy = new Map(profiles.map((p) => [p.Cmid, p.Name]));
  const statBy = new Map(stats.map((s) => [s.Cmid, s]));
  const memberList = members
    .map((m) => {
      const s: any = statBy.get(m.Cmid) ?? {};
      return { Cmid: m.Cmid, Name: nameBy.get(m.Cmid) ?? '', Splats: s.Splats ?? 0, Level: s.Level ?? 0, Xp: s.Xp ?? 0 };
    })
    .sort((a, b) => b.Splats - a.Splats);
  return {
    GroupId: clan.GroupId,
    Name: clan.Name,
    Tag: clan.Tag,
    Members: memberList.length,
    TotalKills: memberList.reduce((sum, m) => sum + m.Splats, 0),
    MemberList: memberList,
  };
}

// Top players, excluding staff (AccessLevel >= 4), the system account and unnamed rows.
async function buildLeaderboard(sort: string, limit: number): Promise<any[]> {
  const sortCol = sort === 'level' ? 'Level' : sort === 'points' ? 'Points' : sort === 'splats' ? 'Splats' : 'Xp';
  const stats = (await models.PlayerStatistics.findAll({ order: [[sortCol, 'DESC']], limit: limit * 3, raw: true })) as any[];
  const cmids = stats.map((s) => s.Cmid);
  const profiles = cmids.length
    ? ((await models.PublicProfile.findAll({ where: { Cmid: { [Op.in]: cmids } }, attributes: ['Cmid', 'Name', 'AccessLevel'], raw: true })) as any[])
    : [];
  const profBy = new Map(profiles.map((p) => [p.Cmid, p]));
  const rows: any[] = [];
  for (const s of stats) {
    const p: any = profBy.get(s.Cmid);
    if (!p || p.Cmid === 0 || !p.Name || (p.AccessLevel ?? 0) >= 4) continue;
    rows.push({ Rank: rows.length + 1, Cmid: s.Cmid, Name: p.Name, Level: s.Level ?? 0, Xp: s.Xp ?? 0, Points: s.Points ?? 0, Splats: s.Splats ?? 0 });
    if (rows.length >= limit) break;
  }
  return rows;
}

// UberStrike GameModeType -> label (EliminationMode is shown as "Team Elimination" in-game).
const GAME_MODE_NAMES: Record<number, string> = { 1: 'Death Match', 2: 'Team Death Match', 4: 'Team Elimination' };

// A player's recent matches (map name + mode + K/D + result).
async function buildMatchHistory(cmid: number, limit: number): Promise<any[]> {
  if (!Number.isFinite(cmid)) return [];
  const matches = (await models.MatchRecord.findAll({
    where: { Cmid: cmid },
    order: [['createdAt', 'DESC']],
    limit,
    raw: true,
  }).catch(() => [])) as any[];
  if (!matches.length) return [];
  const mapIds = [...new Set(matches.map((m) => m.MapId))];
  const maps = (await models.Map.findAll({ where: { MapId: { [Op.in]: mapIds } }, attributes: ['MapId', 'DisplayName'], raw: true }).catch(() => [])) as any[];
  const mapName = new Map(maps.map((m) => [m.MapId, m.DisplayName]));
  return matches.map((m) => ({
    Date: m.createdAt,
    MapId: m.MapId,
    Map: mapName.get(m.MapId) || `Map ${m.MapId}`,
    GameMode: m.GameMode,
    Mode: GAME_MODE_NAMES[m.GameMode] || `Mode ${m.GameMode}`,
    Kills: m.Kills,
    Deaths: m.Deaths,
    KDR: m.Deaths > 0 ? Math.round((m.Kills / m.Deaths) * 100) / 100 : m.Kills,
    Won: !!m.Won,
    Result: m.Won ? 'Victory' : 'Defeat',
    Xp: m.Xp,
    Points: m.Points,
  }));
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
    const p = await buildPlayerProfile(Number(pathname.split('/').pop()));
    if (!p) return json({ error: 'Not found' }, 404);
    return json(p);
  }

  // ===================== Open API (v1) — public, read-only, CORS =====================
  if (pathname.startsWith('/api/v1')) {
    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });

    if (pathname === '/api/v1' || pathname === '/api/v1/') {
      return apiJson({
        name: 'NekoNexus Open API',
        version: 1,
        endpoints: [
          'GET /api/v1/players?q=<name|cmid>&limit=<1-100>',
          'GET /api/v1/players/:cmid',
          'GET /api/v1/players/:cmid/matches?limit=<1-50>',
          'GET /api/v1/clans?limit=<1-100>',
          'GET /api/v1/clans/:groupId',
          'GET /api/v1/leaderboard?sort=xp|level|points|splats&limit=<1-100>',
        ],
      });
    }

    if (pathname === '/api/v1/players' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').trim();
      const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 25, 1), 100);
      const where: any = { Cmid: { [Op.ne]: 0 }, Name: { [Op.ne]: '' } };
      if (q) {
        where[Op.or] = [{ Name: { [Op.like]: `%${q}%` } }, ...(/^\d+$/.test(q) ? [{ Cmid: Number(q) }] : [])];
      }
      const players = await models.PublicProfile.findAll({
        where,
        limit,
        order: [['LastLoginDate', 'DESC']],
        attributes: ['Cmid', 'Name', 'AccessLevel', 'LastLoginDate'],
        raw: true,
      });
      return apiJson(players);
    }

    const v1Player = pathname.match(/^\/api\/v1\/players\/(\d+)$/);
    if (v1Player && method === 'GET') {
      const p = await buildPlayerProfile(Number(v1Player[1]));
      return p ? apiJson(p) : apiJson({ error: 'Not found' }, 404);
    }

    const v1Matches = pathname.match(/^\/api\/v1\/players\/(\d+)\/matches$/);
    if (v1Matches && method === 'GET') {
      const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 20, 1), 50);
      return apiJson(await buildMatchHistory(Number(v1Matches[1]), limit));
    }

    if (pathname === '/api/v1/clans' && method === 'GET') {
      return apiJson(await buildClanList(Math.min(Math.max(Number(url.searchParams.get('limit')) || 50, 1), 100)));
    }

    const v1Clan = pathname.match(/^\/api\/v1\/clans\/(\d+)$/);
    if (v1Clan && method === 'GET') {
      const c = await buildClanDetail(Number(v1Clan[1]));
      return c ? apiJson(c) : apiJson({ error: 'Not found' }, 404);
    }

    if (pathname === '/api/v1/leaderboard' && method === 'GET') {
      const sort = (url.searchParams.get('sort') ?? 'xp').toLowerCase();
      const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 50, 1), 100);
      return apiJson(await buildLeaderboard(sort, limit));
    }

    return apiJson({ error: 'Unknown endpoint. See GET /api/v1' }, 404);
  }

  // ---- a signed-in user's own match history ----
  if (pathname === '/api/me/matches' && method === 'GET') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    return json(await buildMatchHistory(user.cmid, 25));
  }

  // ============================ Web social: friends ============================
  if (pathname === '/api/me/friends' && method === 'GET') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const cmid = user.cmid;
    const all = (await models.ContactRequest.findAll({
      where: { [Op.or]: [{ InitiatorCmid: cmid }, { ReceiverCmid: cmid }] },
      raw: true,
    }).catch(() => [])) as any[];
    const friendCmids = new Set<number>();
    for (const r of all) if (r.Status === 1) friendCmids.add(r.InitiatorCmid === cmid ? r.ReceiverCmid : r.InitiatorCmid);
    const incoming = all.filter((r) => r.Status === 0 && r.ReceiverCmid === cmid);
    const outgoing = all.filter((r) => r.Status === 0 && r.InitiatorCmid === cmid);
    const ids = [...friendCmids, ...incoming.map((r) => r.InitiatorCmid), ...outgoing.map((r) => r.ReceiverCmid)];
    const profiles = ids.length
      ? ((await models.PublicProfile.findAll({ where: { Cmid: { [Op.in]: ids } }, attributes: ['Cmid', 'Name'], raw: true })) as any[])
      : [];
    const nameBy = new Map(profiles.map((p) => [p.Cmid, p.Name]));
    const online = new Set(
      ((await models.ActivePlayer.findAll({ attributes: ['Cmid'], raw: true }).catch(() => [])) as any[]).map((p) => p.Cmid),
    );
    return json({
      friends: [...friendCmids].map((c) => ({ Cmid: c, Name: nameBy.get(c) ?? `Player ${c}`, Online: online.has(c) })),
      incoming: incoming.map((r) => ({ RequestId: r.RequestId, Cmid: r.InitiatorCmid, Name: nameBy.get(r.InitiatorCmid) ?? r.InitiatorName, Message: r.InitiatorMessage })),
      outgoing: outgoing.map((r) => ({ RequestId: r.RequestId, Cmid: r.ReceiverCmid, Name: nameBy.get(r.ReceiverCmid) ?? `Player ${r.ReceiverCmid}` })),
    });
  }

  if (pathname === '/api/me/friends/add' && method === 'POST') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const b = await req.json().catch(() => ({}));
    const target = Number(b.cmid);
    if (!Number.isInteger(target) || target <= 0 || target === user.cmid) return json({ error: 'Invalid player' }, 400);
    const tp: any = await models.PublicProfile.findByPk(target, { raw: true });
    if (!tp || tp.Cmid === 0) return json({ error: 'Player not found' }, 404);
    const existing: any = await models.ContactRequest.findOne({
      where: { [Op.or]: [{ InitiatorCmid: user.cmid, ReceiverCmid: target }, { InitiatorCmid: target, ReceiverCmid: user.cmid }] },
    });
    if (existing && existing.Status === 1) return json({ error: 'Already friends' }, 409);
    if (existing && existing.Status === 0) {
      if (existing.ReceiverCmid === user.cmid) {
        await existing.update({ Status: 1 }); // they already asked us -> accept
        await notifyFriendRequests(existing.InitiatorCmid);
        return json({ ok: true, accepted: true });
      }
      return json({ error: 'Request already sent' }, 409);
    }
    await models.ContactRequest.create({
      RequestId: newMsgId(),
      InitiatorCmid: user.cmid,
      InitiatorName: user.name ?? `Player ${user.cmid}`,
      InitiatorMessage: String(b.message ?? '').slice(0, 200),
      ReceiverCmid: target,
      Status: 0,
      SentDate: new Date(),
    } as any);
    await notifyFriendRequests(target);
    return json({ ok: true });
  }

  if ((pathname === '/api/me/friends/accept' || pathname === '/api/me/friends/decline') && method === 'POST') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const b = await req.json().catch(() => ({}));
    const r: any = await models.ContactRequest.findOne({ where: { RequestId: Number(b.requestId), ReceiverCmid: user.cmid, Status: 0 } });
    if (!r) return json({ error: 'Request not found' }, 404);
    if (pathname.endsWith('accept')) {
      await r.update({ Status: 1 });
      await notifyFriendRequests(r.InitiatorCmid);
    } else {
      await r.update({ Status: 2 });
    }
    return json({ ok: true });
  }

  if (pathname === '/api/me/friends/remove' && method === 'POST') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const b = await req.json().catch(() => ({}));
    const target = Number(b.cmid);
    await models.ContactRequest.destroy({
      where: { Status: 1, [Op.or]: [{ InitiatorCmid: user.cmid, ReceiverCmid: target }, { InitiatorCmid: target, ReceiverCmid: user.cmid }] },
    });
    return json({ ok: true });
  }

  // ============================ Web social: mail ============================
  if (pathname === '/api/me/mail' && method === 'GET') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const msgs = (await models.PrivateMessage.findAll({
      where: { ToCmid: user.cmid, IsDeletedByReceiver: false },
      order: [['DateSent', 'DESC']],
      limit: 100,
      raw: true,
    }).catch(() => [])) as any[];
    return json(
      msgs.map((m) => ({ Id: m.PrivateMessageId, FromCmid: m.FromCmid, FromName: m.FromName, Text: m.ContentText, Date: m.DateSent, IsRead: !!m.IsRead })),
    );
  }

  if (pathname === '/api/me/mail/send' && method === 'POST') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const b = await req.json().catch(() => ({}));
    const to = Number(b.toCmid);
    const text = String(b.text ?? '').trim().slice(0, 1000);
    if (!Number.isInteger(to) || to <= 0 || to === user.cmid) return json({ error: 'Invalid recipient' }, 400);
    if (!text) return json({ error: 'Message is required' }, 400);
    const tp: any = await models.PublicProfile.findByPk(to, { raw: true });
    if (!tp || tp.Cmid === 0) return json({ error: 'Recipient not found' }, 404);
    const id = newMsgId();
    await models.PrivateMessage.create({
      PrivateMessageId: id,
      FromCmid: user.cmid,
      FromName: user.name ?? `Player ${user.cmid}`,
      ToCmid: to,
      DateSent: new Date(),
      ContentText: text,
      IsRead: false,
      IsDeletedBySender: false,
      IsDeletedByReceiver: false,
    } as any);
    await notifyInboxMsg(to, id);
    return json({ ok: true });
  }

  if ((pathname === '/api/me/mail/read' || pathname === '/api/me/mail/delete') && method === 'POST') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const b = await req.json().catch(() => ({}));
    const patch = pathname.endsWith('read') ? { IsRead: true } : { IsDeletedByReceiver: true };
    await models.PrivateMessage.update(patch as any, { where: { PrivateMessageId: Number(b.id), ToCmid: user.cmid } });
    return json({ ok: true });
  }

  // ============================ Web social: chat (shared with in-game lobby) ============================
  // The website and the in-game global lobby share one chat stream. Reads/posts proxy to the ws,
  // which buffers in-game chat and broadcasts web posts into the lobby. Inert if the bridge is off.
  if (pathname === '/api/me/chat' && method === 'GET') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const since = Number(url.searchParams.get('since')) || 0;
    if (!cfg.internalApiKey) return json({ ok: true, lastId: since, messages: [], disabled: true });
    try {
      const r = await fetch(`${cfg.wsInternalUrl}/internal/chat?since=${since}`, {
        headers: { 'X-Internal-Key': cfg.internalApiKey },
      });
      return json(await r.json().catch(() => ({ ok: true, lastId: since, messages: [] })));
    } catch {
      return json({ ok: true, lastId: since, messages: [], offline: true });
    }
  }

  if (pathname === '/api/me/chat' && method === 'POST') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    if (!cfg.internalApiKey) return json({ error: 'Chat is currently unavailable.' }, 503);
    const b = await req.json().catch(() => ({}));
    const text = String(b.text ?? '').trim().slice(0, 200);
    if (!text) return json({ error: 'Message is required' }, 400);
    try {
      const r = await fetch(`${cfg.wsInternalUrl}/internal/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Internal-Key': cfg.internalApiKey },
        body: JSON.stringify({ cmid: user.cmid, name: user.name ?? `Player ${user.cmid}`, text }),
      });
      return json(await r.json().catch(() => ({ ok: true })));
    } catch {
      return json({ error: 'Chat is offline.' }, 502);
    }
  }

  // ---- a signed-in user's own payment / transaction history ----
  if (pathname === '/api/me/payments' && method === 'GET') {
    const user = requireUser(req);
    if (!user) return json({ error: 'Please sign in first.' }, 401);
    const orders = (await models.PaymentOrder.findAll({
      where: { Cmid: user.cmid },
      order: [['createdAt', 'DESC']],
      limit: 50,
      raw: true,
    }).catch(() => [])) as any[];
    return json(
      orders.map((o) => ({
        Date: o.createdAt,
        Credits: o.Credits,
        Amount: (Number(o.PriceCents) || 0) / 100,
        Currency: o.Currency,
        Status: o.Status,
        Fulfilled: !!o.Fulfilled,
        TxId: o.SessionId || o.ExternalId,
        ExternalId: o.ExternalId,
      })),
    );
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
      await pushStats(cmid); // live-refresh level/xp/points if online
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
    // Tell each recipient who gifted them what, in their in-game mailbox.
    const granted = results.filter((r) => r.ok).map((r) => r.cmid);
    const parts = [credits ? `${credits.toLocaleString()} Credits` : '', points ? `${points.toLocaleString()} Coins` : ''].filter(Boolean);
    await postSystemMail(granted, `${auth.name} (Staff) gifted you ${parts.join(' and ')}. Enjoy!`);

    return json({ ok: true, granted: granted.length, credits, points, results });
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

    // Announce the event (or its end) to every player's in-game mailbox.
    try {
      const all = (await models.PublicProfile.findAll({ where: { Cmid: { [Op.ne]: 0 } }, attributes: ['Cmid'], raw: true })) as any[];
      const cmids = all.map((p) => p.Cmid);
      if (pointsMultiplier > 1) {
        const when = durationMinutes > 0
          ? `for the next ${durationMinutes >= 60 ? `${Math.round(durationMinutes / 60)} hour(s)` : `${durationMinutes} min`}`
          : 'until further notice';
        const xpNote = xpMultiplier > 1 ? ` (and ${xpMultiplier}x XP)` : '';
        await postSystemMail(cmids, `🔥 BOOST EVENT: Earn ${pointsMultiplier}x Coins${xpNote} every match ${when}! Jump in and rack up the rewards.`);
      } else {
        await postSystemMail(cmids, `The coin boost event has ended. Thanks for playing!`);
      }
    } catch {
      /* mail is best-effort */
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

    // Shared auth-aware nav script (profile dropdown when signed in).
    if (url.pathname === '/assets/nav.js') {
      return new Response(NAV_JS, {
        headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'public, max-age=300' },
      });
    }

    // Public web store (opened by the in-game "Get Credits" button).
    if (url.pathname === '/store') {
      return page(storeHtml);
    }
    // Public site pages.
    if (url.pathname === '/leaderboard') return page(leaderboardHtml);
    if (url.pathname === '/social') return page(socialHtml);
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
