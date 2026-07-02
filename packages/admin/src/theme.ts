/*
 * Site event theming. The mode is set in the admin panel (Site Event Theme) and stored in the DB, so
 * it can be changed without a redeploy: auto | none | pride | halloween | xmas | newyears | easter.
 * "auto" resolves a theme from the current calendar date (off-season -> none = the default emerald
 * brand). New Year additionally shows a live countdown to midnight in a configurable timezone.
 *
 * Themes are applied by injecting a <style> block + data-theme attribute into every served HTML page,
 * so one setting reskins the whole public site (accent colour, page glow, festive top banner).
 */

export type ThemeName = 'none' | 'halloween' | 'xmas' | 'pride' | 'easter' | 'newyears';

interface ThemeDef {
  accent: string; // primary accent (replaces emerald brand)
  accent2: string; // secondary accent (gradients/glow)
  glow: string; // page background glow colour (rgba)
  banner?: string; // optional festive top-banner text
}

const THEMES: Record<Exclude<ThemeName, 'none'>, ThemeDef> = {
  halloween: { accent: '#f97316', accent2: '#a855f7', glow: 'rgba(249,115,22,.14)', banner: '🎃 Happy Halloween from NekoNexus!' },
  xmas: { accent: '#ef4444', accent2: '#22c55e', glow: 'rgba(34,197,94,.14)', banner: '🎄 Season&#39;s greetings from NekoNexus!' },
  pride: { accent: '#ec4899', accent2: '#8b5cf6', glow: 'rgba(236,72,153,.14)', banner: '🏳️‍🌈 NekoNexus celebrates Pride — everyone&#39;s welcome!' },
  easter: { accent: '#f472b6', accent2: '#34d399', glow: 'rgba(244,114,182,.14)', banner: '🐰 Happy Easter from NekoNexus!' },
  // New Year: gold + fireworks blue. Its banner is generated separately (with the live countdown).
  newyears: { accent: '#fbbf24', accent2: '#38bdf8', glow: 'rgba(251,191,36,.16)' },
};

const DEFAULT_NY_TZ = 'Europe/London';

/** Only allow safe IANA-timezone characters so the value can be embedded in the countdown script. */
export function sanitizeTz(tz: string | undefined): string {
  const t = String(tz ?? '').trim();
  return /^[A-Za-z0-9_+\-/]{1,64}$/.test(t) ? t : DEFAULT_NY_TZ;
}

/** Resolve the admin mode (and 'auto') to a concrete theme for the given moment. */
export function resolveTheme(mode: string | undefined, now: Date = new Date()): ThemeName {
  const t = (mode ?? 'auto').toLowerCase().trim();
  if (t === 'none' || t === 'off' || t === '') return 'none';
  if (t === 'newyears' || t === 'newyear' || t === 'new-year') return 'newyears';
  if (t in THEMES) return t as ThemeName;
  if (t !== 'auto') return 'none';

  // auto: pick by date. Resolved per request so it flips at the boundary without a restart.
  const m = now.getMonth() + 1; // 1-12
  const d = now.getDate();
  if ((m === 12 && d === 31) || (m === 1 && d === 1)) return 'newyears';
  if (m === 12) return 'xmas';
  if (m === 10) return 'halloween';
  if (m === 6) return 'pride';
  if (m === 4 || (m === 3 && d >= 20)) return 'easter'; // Easter is movable; approximate
  return 'none';
}

/** The <style> to inject for a theme (empty for 'none'). */
export function themeHead(theme: ThemeName): string {
  if (theme === 'none') return '';
  const t = THEMES[theme];
  return `<style data-nekonexus-theme="${theme}">
:root{--accent:${t.accent};--accent2:${t.accent2};}
body{background:radial-gradient(1200px 600px at 50% -10%, ${t.glow}, transparent 60%), #0a0a0a !important;}
.text-brand-400,.text-brand-500,.text-brand-600{color:var(--accent)!important;}
.bg-brand-500,.bg-brand-600{background-color:var(--accent)!important;}
.border-brand-500,.border-brand-600{border-color:var(--accent)!important;}
.hover\\:bg-brand-500:hover,.hover\\:bg-brand-600:hover{background-color:var(--accent2)!important;}
.from-brand-400,.from-brand-500{--tw-gradient-from:var(--accent)!important;}
.to-brand-500,.to-brand-600{--tw-gradient-to:var(--accent2)!important;}
a:hover{color:var(--accent);}
#nekonexus-event-banner{background:linear-gradient(90deg,var(--accent),var(--accent2));color:#0a0a0a;
 font-weight:700;text-align:center;padding:.4rem 1rem;font-size:.85rem;letter-spacing:.02em;}
</style>`;
}

/** The visible top banner element (empty for 'none' or themes with no banner). */
export function themeBanner(theme: ThemeName, tz: string = DEFAULT_NY_TZ): string {
  if (theme === 'none') return '';
  if (theme === 'newyears') {
    const z = sanitizeTz(tz);
    const label = z.split('/').pop()!.replace(/_/g, ' ');
    // Client-side countdown to the next 1 Jan 00:00 in the configured timezone; shows "Happy New
    // Year!" for the 24h after midnight. Region/timezone is admin-configurable.
    return `<div id="nekonexus-event-banner">🎆 New Year countdown (${label}): <span id="ny-count">…</span></div>
<script>(function(){var TZ=${JSON.stringify(z)};var el=document.getElementById('ny-count');if(!el)return;
function off(dt){var f=new Intl.DateTimeFormat('en-US',{timeZone:TZ,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});var p={};f.formatToParts(dt).forEach(function(x){p[x.type]=x.value;});var u=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);return u-dt.getTime();}
function jan1(y){var g=Date.UTC(y,0,1,0,0,0);return g-off(new Date(g));}
var yr=+new Intl.DateTimeFormat('en-GB',{timeZone:TZ,year:'numeric'}).format(new Date());
var prev=jan1(yr),next=jan1(yr+1);function pad(n){return(n<10?'0':'')+n;}
function tick(){var n=Date.now();if(n>=prev&&n-prev<864e5){el.textContent='🎉 Happy New Year!';return;}var r=next-n;if(r<=0){el.textContent='🎉 Happy New Year!';return;}var s=Math.floor(r/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),ss=s%60;el.textContent=(d>0?d+'d ':'')+pad(h)+':'+pad(m)+':'+pad(ss);}
tick();setInterval(tick,1000);})();</script>`;
  }
  const t = THEMES[theme];
  return t.banner ? `<div id="nekonexus-event-banner">${t.banner}</div>` : '';
}

/**
 * Inject the resolved theme into a served HTML document: sets <html data-theme>, adds the style to
 * <head>, and drops the banner right after <body>. `mode` is the admin setting (or 'auto'); `tz` is
 * the New Year countdown timezone.
 */
export function applyTheme(html: string, mode: string | undefined, tz: string = DEFAULT_NY_TZ): string {
  const theme = resolveTheme(mode);
  if (theme === 'none') return html;
  let out = html;
  out = out.replace(/<html(\s|>)/i, (m, p1) => `<html data-theme="${theme}"${p1 === '>' ? '>' : p1}`);
  out = out.includes('</head>') ? out.replace('</head>', `${themeHead(theme)}</head>`) : themeHead(theme) + out;
  out = out.replace(/<body([^>]*)>/i, (m) => `${m}${themeBanner(theme, tz)}`);
  return out;
}
