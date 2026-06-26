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
GitHub-hosted runners (windows-latest)
──────────────────────────────────────
publish-client.yml (channel)         release-installer.yml (on v* tag)     build.yml (docker)
  ├─ fetch game refs (GAME_REFS_URL)   ├─ fetch game refs (GAME_REFS_URL)    builds & pushes GHCR:
  ├─ build shim + mod                  ├─ build patcher + mod + installer      ghcr.io/<repo>-realtime
  ├─ stage both channels + manifests   ├─ stage channels + NekoNexusSetup.exe  ghcr.io/<repo>-webservices
  └─ push to `updates` branch          ├─ push to `updates` branch             ghcr.io/<repo>-admin
                │                       └─ upload installer+zip to the Release
                ▼
   GitHub Pages serves the `updates` branch:
   https://<user>.github.io/<repo>/v2/<channel>/updates.yml
```

Everything runs on GitHub's cloud runners — no self-hosted runner needed. The in-game updater points
at the Pages host, so updates are **global** with no private file server. (You can still also serve
them from your own domain — see "Hosting options".)

## One-time setup

1. **`GAME_REFS_URL` secret** — the mod only compiles against the real UberStrike game DLLs
   (`Assembly-CSharp.dll`, `Assembly-CSharp-firstpass.dll`, `Photon3Unity3D.dll`, `UnityEngine.dll`).
   They're proprietary and can't live in the repo, so the cloud jobs **download** them at build time:
   - Zip those four DLLs (from your `UberStrike_Data\Managed`) and host the zip behind an unguessable
     URL (your own server, a private release asset, etc.).
   - Repo *Settings → Secrets and variables → Actions → New repository secret*: name `GAME_REFS_URL`,
     value = that direct-download URL.
2. **GitHub Pages**: repo *Settings → Pages → Deploy from a branch → `updates` / root*.

## Publishing an update

- **Automatic**: push client/shim changes to `dev` → `publish-client.yml` builds + publishes both
  channels on a cloud runner.
- **Manual**: Actions tab → *Publish client update (cloud)* → choose `beta`, `stable`, or `all`.
- **Installer on a release**: push a `vX.Y.Z` tag (or run *Release installer (cloud, on tag)* with a
  tag) → builds `NekoNexusSetup.exe` and attaches it to that tag's Release.
- **Locally** (no CI): `./misc/publish-update.ps1 -Channel all -RefreshInstaller -Push` (needs the
  game refs under `packages/AssemblyReferences/4.7.1/`).

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
