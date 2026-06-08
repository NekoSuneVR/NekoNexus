import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface AdminConfig {
  port: number;
  jwtSecret: string;
  db: DbConfig;
  // Web service internal endpoint, used to push realtime inbox refreshes (e.g. System mail
  // broadcasts) to online players. Inert unless internalApiKey is set (must match the ws side).
  wsInternalUrl: string;
  internalApiKey?: string;
}

// Resolve DB settings from (in order): explicit env vars, an admin.config.yml next to the
// binary, or a Paradise web-service settings yml (so the admin shares the existing DB config).
function loadDbConfig(): DbConfig {
  // 1) Environment overrides
  if (process.env.DB_HOST) {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? 'paradise',
      password: process.env.DB_PASS ?? '',
      database: process.env.DB_NAME ?? 'paradise',
    };
  }

  // 2) A web-service settings yml (DatabaseSettings)
  const candidates = [
    process.env.PARADISE_WS_SETTINGS,
    path.join(process.cwd(), 'Paradise.Settings.WebServices.yml'),
    path.join(process.cwd(), '..', 'Paradise.WebServices', 'Paradise.Settings.WebServices.yml'),
    path.join(process.cwd(), '..', '..', 'packages', 'ws', 'Paradise.Settings.WebServices.yml'),
  ].filter(Boolean) as string[];

  for (const file of candidates) {
    try {
      if (fs.existsSync(file)) {
        const y = YAML.parse(fs.readFileSync(file, 'utf-8'));
        const d = y.DatabaseSettings;
        if (d) {
          return {
            host: String(d.Server ?? '127.0.0.1'),
            port: Number(d.Port ?? 3306),
            user: String(d.Username ?? 'paradise'),
            password: String(d.Password ?? ''),
            database: String(d.DatabaseName ?? 'paradise'),
          };
        }
      }
    } catch {
      /* try next */
    }
  }

  // 3) Fallback defaults
  return { host: '127.0.0.1', port: 3306, user: 'paradise', password: 'paradise', database: 'paradise' };
}

export function loadConfig(): AdminConfig {
  return {
    port: Number(process.env.ADMIN_PORT ?? 8088),
    // Set ADMIN_JWT_SECRET in production so tokens survive restarts and can't be guessed.
    jwtSecret: process.env.ADMIN_JWT_SECRET ?? 'paradise-admin-change-me',
    db: loadDbConfig(),
    // In the docker stack the web service is reachable as http://webservices:8080 on the shared
    // network. INTERNAL_API_KEY must match the value the web service is started with.
    wsInternalUrl: (process.env.WS_INTERNAL_URL ?? 'http://webservices:8080').replace(/\/$/, ''),
    internalApiKey: process.env.INTERNAL_API_KEY,
  };
}
