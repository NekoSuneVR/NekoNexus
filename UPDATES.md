# Client auto-updates (Stable + Beta)

Patched clients check your server for updated mod files on launch and apply them automatically —
so when you fix something, players get it without re-running the installer. There are two
channels: **Stable** (everyone) and **Beta** (testers). Players choose theirs in-game under
**Paradise Settings → Updates**; new installs default to **Stable** with auto-updates **on**.

## How it works
- The in-game updater (`ParadiseUpdater`) fetches
  `https://<your-domain>/updates/v2/<channel>/updates.yml`, compares each file's hash to what's
  installed, downloads any that changed, and applies them (then asks the player to restart).
- The manifest + files are served by the **web service file server** (port 8081, `/updates/`).
- In Docker they come from the host folder **`./server-data/updates`**, mounted read-only into the
  web service container (`docker-compose.yml`). Publishing on the host updates the live server with
  **no image rebuild or restart**.

## Publishing an update

After your fixes are built/committed, on the machine with the repo (needs `dotnet` + `bun`):

```powershell
# push the current build to beta testers first
.\misc\publish-update.ps1 -Channel beta

# ...test in-game on the Beta channel, then promote to everyone:
.\misc\publish-update.ps1 -Channel stable
```

That script:
1. builds the client mod + transport shim,
2. stages the DLLs into `server-data/updates/v2/<channel>/universal/UberStrike_Data/Managed/`,
3. regenerates `server-data/updates/v2/<channel>/updates.yml` (hashes every file).

Because `./server-data/updates` is volume-mounted into the web service, the new files are live
immediately. Players on that channel get them on their next launch.

### Pushing to a remote server (one command)
If your server is a separate box (e.g. your VPS), use the SSH helper to build, upload, and reload
in one go (Windows OpenSSH; uses your SSH key):

```powershell
.\misc\sync-updates.ps1 -SshHost paradise.nekosunevr.co.uk -RemoteDir /opt/paradise -Publish beta
# promote later:
.\misc\sync-updates.ps1 -SshHost paradise.nekosunevr.co.uk -RemoteDir /opt/paradise -Publish stable
```

`-RemoteDir` is the folder on the server that holds `docker-compose.yml`. It uploads
`server-data/updates` there and runs `docker compose up -d webservices`. Omit `-Publish` to just
re-upload the current payload; add `-NoRestart` to skip the reload.

> Tip: `server-data/` is git-ignored (it's generated binary payload). If your build host and your
> server are different machines, copy `server-data/updates` to the server (or point the volume at
> wherever you sync it).

## Recommended flow
1. Land fixes on `dev`.
2. `publish-update.ps1 -Channel beta` → test on a client set to the **Beta** channel.
3. Happy? `publish-update.ps1 -Channel stable` → everyone gets it next launch.

## Notes
- Updates only carry the **Paradise mod DLLs + transport shim** — never game files.
- If a player has auto-updates off, they can still update manually from
  **Paradise Settings → Updates**, or just re-run the installer.
- HTTPS: the updater uses whatever the client's File Server URL is, so behind your domain it's
  `https://<domain>/updates/...` (make sure your reverse proxy already serves `/updates/`, which it
  does alongside `/images/`).
