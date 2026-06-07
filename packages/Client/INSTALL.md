# Paradise — UberStrike free-server client patch

This patches your own copy of **UberStrike** to play on a Paradise free server (no Photon
SDK). It is **self-contained** — you only need this folder, Windows PowerShell, and your game.
No game files are included or redistributed; the patch runs against *your* install.

## Requirements
- A Steam copy of **UberStrike** installed.
- **Windows** with PowerShell (built in).

## Install

1. **Fully close UberStrike** (and quit it in Steam) — the patch can't replace files while it runs.
2. Unzip this folder somewhere.
3. Open **PowerShell** in this folder (Shift-right-click → *Open PowerShell window here*).
4. Run one of these:

   **Behind an HTTPS domain / reverse proxy** (recommended):
   ```powershell
   .\install-paradise.ps1 -UberStrikePath "C:\Program Files (x86)\Steam\steamapps\common\UberStrike" -ServerHost play.example.com -Https
   ```

   **Plain IP + ports** (no domain):
   ```powershell
   .\install-paradise.ps1 -UberStrikePath "C:\Program Files (x86)\Steam\steamapps\common\UberStrike" -ServerHost 203.0.113.10
   ```

   If PowerShell blocks the script, run it once as:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\install-paradise.ps1 -UberStrikePath "C:\...\UberStrike" -ServerHost play.example.com -Https
   ```

5. Launch UberStrike. You can add/switch servers anytime in **Paradise Settings → Web Service URLs**.

## Undo / revert to the original game
The patch keeps backups:
- `UberStrike_Data\Managed\backup\Assembly-CSharp.dll` — the original game code.
- `UberStrike_Data\Managed\Photon3Unity3D.dll.orig` — the original Photon transport.

To revert, copy each backup back over its file (and delete `Paradise.Settings.Client.xml`),
or use Steam → UberStrike → Properties → Installed Files → **Verify integrity**.

## Troubleshooting
- **"UberStrike is running"** — close the game (and quit Steam's copy), then re-run.
- **Still connecting to an old/local server** — you patched before against another address; the
  client caches the URL. Change it in-game (Paradise Settings → Web Service URLs), or reset once:
  ```powershell
  Remove-Item 'HKCU:\Software\Cmune\UberStrike' -Recurse
  ```
- **"Couldn't connect to server"** — the web service works but realtime (UDP) doesn't. Ask the
  server owner to confirm UDP **5055/5155** are open and the server list IP is their public IP/domain.

## What's in this zip
- `install-paradise.ps1` — the installer.
- `patcher\` — UniversalUnityPatcher (injects the Paradise bootstrap).
- `mod\` — prebuilt Paradise client DLLs.
- `Photon3Unity3D.dll` — the free LiteNetLib transport (replaces Photon).
- `Paradise.Patch.xml`, `Paradise.Settings.Client.template.xml` — patch definition + settings template.
