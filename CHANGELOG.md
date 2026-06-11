# Changelog

## 4.7.2 — Connectivity, friends/mail, in-game store, one-click installer

Fixes that get players actually online + talking, an antivirus-friendly one-click installer,
a NekoPay-powered in-game store, and a safer (non-destructive) database seed.

### Client / connectivity
- **Realtime now connects** — the LiteNetLib client shim binds **IPv4-only** (`IPv6Mode.Disabled`).
  Fixes `SocketException: An address incompatible with the requested protocol was used` on PCs
  with IPv6 disabled, which broke the server browser / lobby with "Couldn't connect to server".
- **"Get Credits" no longer freezes the game.** Hooked `ApplicationDataManager.OpenBuyCredits` to
  open the NekoNexus **web store** in the browser instead of the native credit-bundle page (which
  has no bundles here and threw every frame, locking the UI).

### One-click installer + patcher
- **`NekoNexusSetup.exe`** (Inno Setup) — single native installer: auto-detects UberStrike from
  Steam (registry + `libraryfolders.vdf`), patches, and **auto-downloads/installs .NET 4.8** if
  missing. No `.cmd`, no PowerShell. Built via `misc/build-installer.ps1`.
- **Self-contained patch zip** with a double-click `Install.cmd`, Steam auto-detect, and a baked
  `nekonexus-target.json` (server owners set their domain once). Ships prebuilt mod DLLs — no repo
  or .NET SDK needed by players.
- **Patch-order fix**: install the mod DLLs **before** patching — the patch injects a call into
  `NekoNexus.Client.Bootstrap`, which must be resolvable, or the patcher failed (exit 1).
- Dedicated **`patcher` branch** holds the ready-to-download toolkit.

### Friends, mail, presence (server-side)
- **Add friend** now works: `SendContactRequest` sets `Status: Pending` (the column had no DB
  default, so requests were invisible) and **re-sends/repairs** an existing non-accepted request.
- **Private messages**: fixed the inbox thread list (`.filter` not `.find`), the send-message
  response serialization, and a `cmid` casing typo.
- Disconnect now reliably leaves the lobby (handled in `LobbyRoom`), keeping presence accurate.

### Clans
- **Clan invites work**: `AcceptClanInvitation` created the member row **without `GroupId`** (no
  real membership) — fixed. The clan **`[TAG]`** now shows next to names in chat: the tag is written
  to the profile on create/join (cleared on leave/kick/disband) and carried on the comm actor.

### Gameplay / realtime stability
- In-match ops that **threw** (and aborted the op): **quick-item activation** and **hit-feedback**
  knockback are now implemented (broadcast to peers); ready-up, in-match gear/health/damage,
  game-info, inspect-room, report-player and backend-refresh are safe no-ops instead of exceptions.
- **Moderator ban/kick** of an *offline* player no longer NullReferences; **unban** is implemented.
- **Match progression is saved again**: points + XP/stats persistence (`DepositPoints` /
  `UpdatePlayerStatistics`) was commented out during the port — re-enabled, so players keep XP,
  level and stats after matches.

### Shop / economy
- **Get Credits & the shop's Credits tab no longer freeze the game** — both open the web store.
- **BuyItem**: the item was granted **even when payment failed** (and Points purchases deducted
  Points but wrote to Credits) — now items are only granted on a successful purchase.
- **VerifyAuthToken** returned wallet data as player stats — fixed.

### In-game store + payments
- Admin serves a public **`/store`** page (opened by Get Credits): lists credit packages, **Buy**
  creates a **NekoPay** checkout, webhook grants credits. `/pay/success|cancel` return pages.
- Seeds 4 starter credit packages on first run (edit in **Store → Packages**).

### Docker / CI / database
- **Non-destructive seed**: `sync({ alter: true })` + seed-only-if-empty — re-running the seed
  never wipes players, wallets, stats, friends, or customizations (was `force: true`).
- Admin **Docker image** + compose service (`:8088`); compose pulls prebuilt **GHCR** images.
- `PARADISE_PUBLIC_HOST` seeds the realtime server list with a reachable IP (not `127.0.0.1`).
- CI: lowercase GHCR tags, `working-directory` bun builds, `Directory.Build.props` so the net35/
  net481 server compiles on Linux, copy all workspace manifests for `bun install`.
- Reverse-proxy reference: forwarded headers, body size, `/store` + `/pay`, UDP/TLS caveats.

## 4.7.1 — Free, cross-platform server + admin platform

This release removes the proprietary Photon Server SDK, makes the whole stack free and
cross-platform, and adds an admin dashboard, store, and payments.

### De-Photon (free server)
- Replaced `Photon.SocketServer.dll`, `PhotonHostRuntimeInterfaces.dll`, `Photon3Unity3D.dll`
  and `UnityEngine.dll` (server-side) with free managed shims over **LiteNetLib** (`shims/`).
  No Photon licence, no CCU/slot cap — set your own `MaxPlayerCount`/`--max-peers`.
- Self-host launcher `NekoNexus.Realtime.Host` replaces `PhotonSocketServer.exe`
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
