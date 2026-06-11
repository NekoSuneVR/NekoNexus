/*
 * Steam OpenID 2.0 login for normal site users. Players already have a SteamMember row (SteamId ->
 * Cmid), so after Steam verifies the user we map the Steam64 id back to their NekoNexus account and
 * issue a USER session token (separate from the admin username/password token).
 *
 * OpenID 2.0 needs no API key for the auth itself; the optional Steam Web API key is only used to
 * fetch a display name / avatar.
 */

const STEAM_OPENID = 'https://steamcommunity.com/openid/login';

/** Build the URL to redirect the user to Steam for sign-in. */
export function beginSteamLogin(realm: string, returnTo: string): string {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnTo,
    'openid.realm': realm,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });
  return `${STEAM_OPENID}?${params.toString()}`;
}

/**
 * Verify the OpenID assertion Steam sent back. Returns the Steam64 id on success, else null.
 * We echo the params back to Steam with mode=check_authentication and trust only is_valid:true.
 */
export async function verifySteamReturn(query: URLSearchParams): Promise<string | null> {
  if (query.get('openid.mode') !== 'id_res') return null;

  const claimedId = query.get('openid.claimed_id') ?? '';
  const match = claimedId.match(/^https?:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/);
  if (!match) return null;

  // Re-send every openid.* param with mode swapped to check_authentication.
  const body = new URLSearchParams();
  for (const [k, v] of query.entries()) {
    if (k.startsWith('openid.')) body.set(k, v);
  }
  body.set('openid.mode', 'check_authentication');

  try {
    const res = await fetch(STEAM_OPENID, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const text = await res.text();
    if (/is_valid\s*:\s*true/i.test(text)) return match[1];
  } catch {
    /* fall through */
  }
  return null;
}

/** Optional: fetch a Steam display name + avatar (needs a Steam Web API key). */
export async function fetchSteamProfile(
  steamId: string,
  apiKey: string | undefined,
): Promise<{ personaName?: string; avatar?: string } | null> {
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`,
    );
    const data: any = await res.json();
    const p = data?.response?.players?.[0];
    return p ? { personaName: p.personaname, avatar: p.avatarfull } : null;
  } catch {
    return null;
  }
}
