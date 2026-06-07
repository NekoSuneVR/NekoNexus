# Changelog

## 4.7.1 — Free, cross-platform server + admin platform

This release removes the proprietary Photon Server SDK, makes the whole stack free and
cross-platform, and adds an admin dashboard, store, and payments.

### De-Photon (free server)
- Replaced `Photon.SocketServer.dll`, `PhotonHostRuntimeInterfaces.dll`, `Photon3Unity3D.dll`
  and `UnityEngine.dll` (server-side) with free managed shims over **LiteNetLib** (`shims/`).
  No Photon licence, no CCU/slot cap — set your own `MaxPlayerCount`/`--max-peers`.
- Self-host launcher `Paradise.Realtime.Host` replaces `PhotonSocketServer.exe`
  (reads `PhotonServer.config`, one app per process, `--master-host` override).
- Client `Photon3Unity3D` shim matched to the original DLL's exact signatures + enum values
  (verified with Mono.Cecil). Fixed: NAT-punch module crash on Unity Mono, `CallInBackground`
  signature, `StatusCode`/`PeerStateValue` enum values, `SupportClass`, `uberdaemon` fallback.

### Cross-platform / deployment
- **Docker** multi-arch (amd64 + arm64): `docker-compose.yml` + `docker/` (db, web services,
  Comm, Game). Web services build standalone exes for Windows/Linux/macOS (x64 + arm64) via Bun.
- **GitHub Actions** (`.github/workflows/build.yml`): builds server exes, client patch toolkit,
  and multi-arch Docker images on tags.
- Windows one-click: **Server Manager GUI** (configure MySQL / server name / slots, initialise
  DB, start all nodes) + `start-server.bat`.
- One-domain reverse-proxy configs (Caddy + nginx) in `misc/reverse-proxy/`. See `DOMAIN-SETUP.md`.

### Client patcher
- `make-client-patch.ps1` patches a local UberStrike install to use the free server + transport
  (game files never redistributed). Built `UniversalUnityPatcher`. Releases zip in `.release/client`.

### Web service
- Added a `seed` subcommand to the web service exe (initialise the database).
- Fixed seeding: bundle `mysql2`, disable FK checks while seeding, `sync({force})` clean schema.
- Server-list now respects `PhotonServer.Enabled`; aligned PhotonIds.
- **Realtime presence is now live**: Comm/Game publish their roster every 5s; the master rebuilds
  player/room state idempotently (no more stale/duplicate data).

### Admin dashboard (`packages/admin`)
- New Tailwind dark/green dashboard exe. Secure login (default `admin`/`admin`, change in-app).
- **Servers**: add (IP, port, name, region with IP auto-detect), enable/disable, online status.
- **Players**: search, ban/unban, edit level/XP/points, edit credits, set access level,
  **give item via searchable name dropdown** (weapons/gear/quick/functional). Level edits now
  set XP to the level threshold so the game keeps the level (no reset to 1). Max level configurable
  (e.g. 750).
- **Leaderboard** (staff + unnamed accounts hidden). **Reports** (moderation log).
- **Store + NekoPay**: credit packages, orders, "set all shop items free", hosted-checkout
  creation + webhook that grants credits on payment (idempotent). Secret via git-ignored
  `.nekopay.env`.

### Repo hygiene
- `.gitignore` excludes build output, generated shim DLLs, and all secrets (`.env`, `.nekopay.env`).
