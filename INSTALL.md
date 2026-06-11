# NekoNexus — UberStrike free-server client patch

This patches your own copy of **UberStrike** to play on a NekoNexus free server (no Photon
SDK). It is **self-contained** — you only need this folder, Windows PowerShell, and your game.
No game files are included or redistributed; the patch runs against *your* install.

## Requirements
- A Steam copy of **UberStrike** installed.
- **Windows** with PowerShell (built in).
- **.NET Framework 4.7.2+** (the patcher needs it). Windows 10/11 already include 4.8 — only
  older/stripped Windows may need it: https://dotnet.microsoft.com/download/dotnet-framework

## Install (easy — double-click)

1. **Fully close UberStrike** (and quit it in Steam) — the patch can't replace files while it runs.
2. Unzip this folder somewhere.
3. Double-click **`Install.cmd`**.

That's it. The game is found automatically from Steam, and the server is read from
`nekonexus-target.json` (already set to the right server). Then launch UberStrike.

## Install (manual / non-standard setup)

If your game isn't in a normal Steam library, open **PowerShell** in this folder and point at it:
```powershell
.\install-nekonexus.ps1 -UberStrikePath "D:\Games\UberStrike"
```
You can also override the server: `-ServerHost play.example.com -Https` (or `-ServerHost 203.0.113.10` for plain IP + ports).

If PowerShell blocks the script, prefix it with `powershell -ExecutionPolicy Bypass -File `.

After patching, launch UberStrike — you can add/switch servers anytime in **NekoNexus Settings → Web Service URLs**.

## For server owners — make this YOUR installer
Edit **`nekonexus-target.json`** before sharing the zip:
```json
{ "ServerHost": "play.yourdomain.com", "Https": true, "WebPort": 8080, "FilePort": 8081 }
```
Set `Https` to `false` and fill `WebPort`/`FilePort` if you serve plain HTTP on IP+ports. Then your
users just double-click `Install.cmd` — no typing.

## Undo / revert to the original game
The patch keeps backups:
- `UberStrike_Data\Managed\backup\Assembly-CSharp.dll` — the original game code.
- `UberStrike_Data\Managed\Photon3Unity3D.dll.orig` — the original Photon transport.

To revert, copy each backup back over its file (and delete `NekoNexus.Settings.Client.xml`),
or use Steam → UberStrike → Properties → Installed Files → **Verify integrity**.

## Troubleshooting
- **"UberStrike is running"** — close the game (and quit Steam's copy), then re-run.
- **Still connecting to an old/local server** — you patched before against another address; the
  client caches the URL. Change it in-game (NekoNexus Settings → Web Service URLs), or reset once:
  ```powershell
  Remove-Item 'HKCU:\Software\Cmune\UberStrike' -Recurse
  ```
- **"Couldn't connect to server"** — the web service works but realtime (UDP) doesn't. Ask the
  server owner to confirm UDP **5055/5155** are open and the server list IP is their public IP/domain.

## What's in this zip
- `Install.cmd` — double-click installer (calls the script below).
- `install-nekonexus.ps1` — the installer (Steam auto-detect + config).
- `nekonexus-target.json` — the server this installer points at (owners edit this).
- `patcher\` — UniversalUnityPatcher (injects the NekoNexus bootstrap).
- `mod\` — prebuilt NekoNexus client DLLs.
- `Photon3Unity3D.dll` — the free LiteNetLib transport (replaces Photon).
- `NekoNexus.Patch.xml`, `NekoNexus.Settings.Client.template.xml` — patch definition + settings template.
