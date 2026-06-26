# Client auto-updates & CI

How the in-game auto-updater gets new client builds, why it was failing, and how the GitHub
Actions automation publishes updates globally.

## Why "Failed to download" happened

The in-game updater reads a manifest (`/updates/v2/<channel>/updates.yml`) that lists each client
DLL with its hash, then downloads each file from the same server. The manifest was published, but
the **actual DLLs were never staged next to it** on the file server — so every file download 404'd
("Failed to download …"). The payload binaries are build outputs (gitignored) that only exist after
the mod is built; publishing the manifest without them leaves the channel broken.

(`NekoNexusUpdater.InstallUpdates` was also hardened: it now guards transport-level download
failures and adds a per-file timeout, so a stalled/unreachable download reports cleanly instead of
throwing inside the coroutine.)

## The hard constraint

`NekoNexus.Client.dll` only compiles against the **real UberStrike game assemblies**
(`Assembly-CSharp.dll`, `UnityEngine.dll`, …). Those are proprietary (Cmune's) and must **not** be
committed to the repo or uploaded to GitHub-hosted runners. So the client mod can only be built on a
machine that has UberStrike installed. The server-side images (realtime / ws / admin) have no such
dependency and keep building on GitHub-hosted runners.

## The pipeline

```
self-hosted runner (your UberStrike PC)                    GitHub-hosted runners
─────────────────────────────────────                     ─────────────────────
publish-client.yml                                         build.yml (docker job)
  └─ misc/publish-update.ps1 -Channel all -RefreshInstaller -Push
       ├─ build shim + mod + bootstrap + RPC               builds & pushes GHCR images:
       ├─ stage DLLs -> server-data/updates/v2/{beta,stable}/…   ghcr.io/<repo>-realtime
       ├─ gen-updates  (regenerate manifests w/ hashes)          ghcr.io/<repo>-webservices
       ├─ refresh NekoNexusSetup.exe (installer w/ same DLLs)    ghcr.io/<repo>-admin
       └─ publish-update-branch.ps1  → force-push to `updates` branch
                                          │
                                          ▼
                              GitHub Pages serves the `updates` branch:
                              https://<user>.github.io/<repo>/v2/<channel>/updates.yml
                              https://<user>.github.io/<repo>/NekoNexusSetup.exe
```

The in-game updater points at the Pages host, so updates are **global** with no private file server.
(You can still also serve them from your own domain — see "Hosting options".)

## One-time setup

1. **Self-hosted runner** (on your UberStrike PC): repo *Settings → Actions → Runners → New
   self-hosted runner* (Windows; keep the default `self-hosted`, `windows` labels). Install on that
   machine: .NET SDK, Bun, git, Inno Setup 6 (`winget install JRSoftware.InnoSetup`).
2. **Point the runner at your game DLLs**: set a machine/user env var `UBERSTRIKE_MANAGED` to your
   `…\UberStrike\UberStrike_Data\Managed` folder. The workflow copies the reference assemblies from
   there each run (they never enter the repo).
3. **GitHub Pages**: repo *Settings → Pages → Deploy from a branch → `updates` / root*.

## Publishing an update

- **Automatic**: push client/shim changes to `dev` → `publish-client.yml` runs on your self-hosted
  runner and publishes both channels.
- **Manual**: Actions tab → *Publish client update* → choose `beta`, `stable`, or `all`.
- **Locally** (no CI): `./misc/publish-update.ps1 -Channel all -RefreshInstaller -Push`.

`beta` is for testers; promote by publishing `stable` (or `all`). Players with Auto-Updates on get
the new files on next launch and are prompted to restart.

## Pointing the client at the updates host

The updater builds the catalog URL as `<FileServerUrl><UpdateEndpoint>/v2/<channel>/updates.yml`.

- **GitHub Pages**: in-game *NekoNexus Settings → Web Service URLs*, or `NekoNexusPrefs` defaults —
  set the file-server host to `https://<user>.github.io/<repo>` and the update endpoint to `/`
  (the channel lives at `/v2/<channel>/…` on the `updates` branch root).
- The installer/patcher writes these for fresh installs; existing installs keep the value stored in
  Unity PlayerPrefs, so change it in-game if migrating.

## Hosting options (pick one — both can coexist)

| Host | How updates get there | Updater URL |
| --- | --- | --- |
| **GitHub Pages** (recommended) | `-Push` → `updates` branch → Pages | `https://<user>.github.io/<repo>` + `/` |
| **Your docker file server** | on the VPS, check out the `updates` branch into `server-data/updates` (it's mounted read-only into the webservices container at `/updates`); or run `publish-update.ps1` on the VPS if it has the refs | `https://<your-domain>` + `/updates` |

## Rebuilding the Docker images

`build.yml` already rebuilds and pushes the GHCR images on every push to `dev`/`main`, or on demand
(Actions → *Build NekoNexus* → Run workflow). On the VPS: `docker compose pull && docker compose up -d`.
The realtime/ws/admin images don't depend on the game refs, so they always build on hosted runners.
