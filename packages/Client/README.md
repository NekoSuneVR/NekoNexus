# Paradise client patch — connect UberStrike to the FREE server

This patches your UberStrike client to run Paradise on the **free LiteNetLib server**
(no Photon SDK), and points it at **your** server. The in-game *Paradise Settings → Web
Service URLs* list is your **server browser** — add as many servers as you like and switch
between them.

> You must own a copy of UberStrike. The patch is applied to *your* game files; UberStrike
> game assemblies are never redistributed here.

## What makes the connection work

1. **Free transport** — our `Photon3Unity3D.dll` shim replaces the game's Photon client, so
   the game speaks LiteNetLib to the free Paradise server (`shims/Photon3Unity3D.Shim`).
2. **Server address** — `Paradise.Settings.Client.xml` (or the in-game URL list) points the
   client at your web service, which hands back the realtime server list.

## One-command patch (from a repo checkout)

```powershell
# Build the patcher once (Visual Studio Build Tools / MSBuild + nuget):
#   nuget restore packages/Patcher/UniversalUnityPatcher.sln
#   msbuild packages/Patcher/UniversalUnityPatcher.sln /p:Configuration=Release

packages\Client\make-client-patch.ps1 `
  -UberStrikePath "C:\Program Files (x86)\Steam\steamapps\common\UberStrike" `
  -ServerHost 127.0.0.1
```

This builds the Paradise client mod against your game, injects the bootstrap, installs our
free transport, and writes a settings file. Re-run after `git pull` to update.

## From the packaged release (`.release/client/_pak/free-server/`)

The release bundle contains the prebuilt patcher, our free `Photon3Unity3D.dll`, the patch
definition, a settings template, and `make-client-patch.ps1`. Unzip it next to a repo
checkout (it reuses the build) and run the command above.

## Already running official Paradise?

You only need to (a) drop our `Photon3Unity3D.dll` into `UberStrike_Data\Managed\`
(back up the original first) and (b) add your server's web-service URL in
*Paradise Settings → Web Service URLs*. No re-patch required.

## Notes / caveats

- The mod build temporarily overwrites `packages/AssemblyReferences/4.7.1/UnityEngine.dll`
  with your game's real one. Rebuilding the **server** restores the headless shim there.
- `EncryptWebServiceTraffic` is on by default and must match the server's
  `EncryptionPassPhtase` / `EncryptionInitVector` (already set in the Docker config).
- This client patch has not been auto-tested end-to-end here (it needs a real UberStrike
  install). If anything errors, capture the output and it can be fixed quickly.
