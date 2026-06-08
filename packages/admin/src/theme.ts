/*
 * Site event theming. SITE_THEME env = none | halloween | xmas | pride | easter | auto.
 * "auto" resolves a theme from the current calendar date (off-season -> none).
 *
 * Themes are applied by injecting a <style> block + data-theme attribute into every served HTML
 * page, so a single env var reskins the whole public site (accent colour, page glow, and a small
 * festive top banner) without touching each page's markup. The default brand is emerald.
 */

export type ThemeName = 'none' | 'halloween' | 'xmas' | 'pride' | 'easter';

interface ThemeDef {
  accent: string; // primary accent (replaces emerald brand)
  accent2: string; // secondary accent (gradients/glow)
  glow: string; // page background glow colour (rgba)
  banner?: string; // optional festive top-banner text
}

const THEMES: Record<Exclude<ThemeName, 'none'>, ThemeDef> = {
  halloween: { accent: '#f97316', accent2: '#a855f7', glow: 'rgba(249,115,22,.14)', banner: '🎃 Happy Halloween from Paradise!' },
  xmas: { accent: '#ef4444', accent2: '#22c55e', glow: 'rgba(34,197,94,.14)', banner: '🎄 Season&#39;s greetings from Paradise!' },
  pride: { accent: '#ec4899', accent2: '#8b5cf6', glow: 'rgba(236,72,153,.14)', banner: '🏳️‍🌈 Paradise celebrates Pride — everyone&#39;s welcome!' },
  easter: { accent: '#f472b6', accent2: '#34d399', glow: 'rgba(244,114,182,.14)', banner: '🐰 Happy Easter from Paradise!' },
};

/** Resolve 'auto' (and validate explicit values) to a concrete theme. */
export function resolveTheme(siteTheme: string | undefined): ThemeName {
  const t = (siteTheme ?? 'auto').toLowerCase().trim();
  if (t === 'none' || t === 'off' || t === '') return 'none';
  if (t in THEMES) return t as ThemeName;
  if (t !== 'auto') return 'none';

  // auto: pick by date. (Server-local time; resolved per request so it flips without a restart.)
  const now = new Date();
  const m = now.getMonth() + 1; // 1-12
  const d = now.getDate();
  if (m === 10) return 'halloween';
  if (m === 12) return 'xmas';
  if (m === 6) return 'pride';
  // Easter is movable; approximate with late March / April.
  if (m === 4 || (m === 3 && d >= 20)) return 'easter';
  return 'none';
}

/** The <style> + tiny banner markup to inject for a theme (empty string for 'none'). */
export function themeHead(theme: ThemeName): string {
  if (theme === 'none') return '';
  const t = THEMES[theme];
  // Override the emerald brand utility classes the pages use, the body glow, and links.
  return `<style data-paradise-theme="${theme}">
:root{--accent:${t.accent};--accent2:${t.accent2};}
body{background:radial-gradient(1200px 600px at 50% -10%, ${t.glow}, transparent 60%), #0a0a0a !important;}
.text-brand-400,.text-brand-500,.text-brand-600{color:var(--accent)!important;}
.bg-brand-500,.bg-brand-600{background-color:var(--accent)!important;}
.border-brand-500,.border-brand-600{border-color:var(--accent)!important;}
.hover\\:bg-brand-500:hover,.hover\\:bg-brand-600:hover{background-color:var(--accent2)!important;}
.from-brand-400,.from-brand-500{--tw-gradient-from:var(--accent)!important;}
.to-brand-500,.to-brand-600{--tw-gradient-to:var(--accent2)!important;}
a:hover{color:var(--accent);}
#paradise-event-banner{background:linear-gradient(90deg,var(--accent),var(--accent2));color:#0a0a0a;
 font-weight:700;text-align:center;padding:.4rem 1rem;font-size:.85rem;letter-spacing:.02em;}
</style>`;
}

/** The visible top banner element (empty for 'none' or themes with no banner). */
export function themeBanner(theme: ThemeName): string {
  if (theme === 'none') return '';
  const t = THEMES[theme];
  return t.banner ? `<div id="paradise-event-banner">${t.banner}</div>` : '';
}

/**
 * Inject the resolved theme into a served HTML document: sets <html data-theme>, adds the style to
 * <head>, and drops the banner right after <body>. Falls back to returning html unchanged.
 */
export function applyTheme(html: string, siteTheme: string | undefined): string {
  const theme = resolveTheme(siteTheme);
  if (theme === 'none') return html;
  let out = html;
  out = out.replace(/<html(\s|>)/i, (m, p1) => `<html data-theme="${theme}"${p1 === '>' ? '>' : p1}`);
  out = out.includes('</head>') ? out.replace('</head>', `${themeHead(theme)}</head>`) : themeHead(theme) + out;
  out = out.replace(/<body([^>]*)>/i, (m) => `${m}${themeBanner(theme)}`);
  return out;
}
