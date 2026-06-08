/*
 * Twitch "now streaming UberStrike" lookup for the public /streams page. Uses an app access token
 * (client-credentials) cached in-memory, resolves the UberStrike game id once, then lists live
 * streams. If credentials aren't configured the caller shows a friendly hint instead.
 */

interface TwitchStream {
  id: string;
  userName: string;
  title: string;
  viewerCount: number;
  thumbnailUrl: string;
  startedAt: string;
  url: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedGameId: string | null = null;

async function getAppToken(clientId: string, clientSecret: string): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;
  try {
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }).toString(),
    });
    const data: any = await res.json();
    if (!data?.access_token) return null;
    cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
    return cachedToken.token;
  } catch {
    return null;
  }
}

async function helix(path: string, token: string, clientId: string): Promise<any> {
  const res = await fetch(`https://api.twitch.tv/helix/${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Client-Id': clientId },
  });
  return res.json();
}

/** Live streams currently playing UberStrike, sorted by viewers. Empty array if unavailable. */
export async function getUberStrikeStreams(
  clientId: string | undefined,
  clientSecret: string | undefined,
  gameName = 'UberStrike',
): Promise<TwitchStream[]> {
  if (!clientId || !clientSecret) return [];
  const token = await getAppToken(clientId, clientSecret);
  if (!token) return [];

  try {
    if (!cachedGameId) {
      const games = await helix(`games?name=${encodeURIComponent(gameName)}`, token, clientId);
      cachedGameId = games?.data?.[0]?.id ?? null;
    }
    if (!cachedGameId) return [];

    const streams = await helix(`streams?game_id=${cachedGameId}&first=50`, token, clientId);
    const list: any[] = streams?.data ?? [];
    return list
      .map((s) => ({
        id: s.id,
        userName: s.user_name,
        title: s.title,
        viewerCount: s.viewer_count,
        thumbnailUrl: (s.thumbnail_url ?? '').replace('{width}', '440').replace('{height}', '248'),
        startedAt: s.started_at,
        url: `https://twitch.tv/${s.user_login}`,
      }))
      .sort((a, b) => b.viewerCount - a.viewerCount);
  } catch {
    return [];
  }
}
