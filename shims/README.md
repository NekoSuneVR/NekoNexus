# NekoNexus free / cross-platform shims

This folder replaces the **proprietary, paid, Windows-only** dependencies the original
NekoNexus build expected you to drop in by hand, with **free managed re-implementations**.
The goal: run the UberStrike realtime server with **no Photon Server SDK** (no licence, no
CCU/slot paywall — you set your own slot count) on **Linux ARM64, Linux AMD64, and Windows**.

## What replaces what

| Proprietary DLL (was a manual drop-in) | Free shim project | Output location |
|---|---|---|
| `UnityEngine.dll` (math/types used by shared `UberStrike.Core`) | `UnityEngine.Shim` | `packages/AssemblyReferences/4.7.1/` and `packages/Core/AssemblyReferences/` |
| `Photon.SocketServer.dll` (server transport) | `Photon.SocketServer.Shim` | `packages/AssemblyReferences/` |
| `PhotonHostRuntimeInterfaces.dll` (`DisconnectReason`) | `PhotonHostRuntimeInterfaces.Shim` | `packages/AssemblyReferences/` |
| `Photon3Unity3D.dll` (client `ExitGames.Client.Photon`) | `Photon3Unity3D.Shim` | `packages/Core/AssemblyReferences/` |

The shims output to the exact paths the existing `<HintPath>` references expect, so **no
existing `.csproj` is edited** (except removing two genuinely-unused `ExitGames*` refs).

## How it works (Strategy B — both-ends transport shim)

Both the client (`PhotonPeer`) and server (`Photon.SocketServer`) speak the same tiny
message envelope: a kind (operation / event / response), a `byte` code, and a
`Dictionary<byte,object>` whose values are almost always a `byte[]` (UberStrike's own
serialized payloads, passed through untouched). Because we own **both** shims we don't have
to reproduce Photon's proprietary wire protocol — we just agree on one codec
(`_shared/NekoNexusWire.cs`) and carry it over **LiteNetLib** (vendored, MIT, in `_vendor/`).

```
UberStrike client (Unity)                 NekoNexus server (.NET)
  game code (unchanged)                     NekoNexus.Realtime (unchanged)
        |                                          |
  PhotonPeer shim  <----- LiteNetLib UDP ----->  Photon.SocketServer shim
  (Photon3Unity3D.dll)    + NekoNexusWire codec   (Photon.SocketServer.dll + RealtimeHost)
```

Slot count is just `RealtimeHostOptions.MaxPeers` — no licence check.

## Building the shims

```
dotnet build shims/UnityEngine.Shim/UnityEngine.Shim.csproj -c Release
dotnet build shims/PhotonHostRuntimeInterfaces.Shim/PhotonHostRuntimeInterfaces.Shim.csproj -c Release
dotnet build shims/Photon.SocketServer.Shim/Photon.SocketServer.Shim.csproj -c Release
dotnet build shims/Photon3Unity3D.Shim/Photon3Unity3D.Shim.csproj -c Release
```

Then `dotnet build packages/Realtime/NekoNexus.Realtime/NekoNexus.Realtime.csproj` builds the
whole server with no Photon SDK present.

## Status / TODO

- [x] UnityEngine shim — shared `UberStrike.Core` compiles.
- [x] Photon.SocketServer + PhotonHostRuntimeInterfaces shims — `NekoNexus.Realtime` compiles & links.
- [x] Photon3Unity3D client shim — functional LiteNetLib `PhotonPeer`.
- [ ] Self-host launcher (`NekoNexus.Realtime.Host`) replacing `PhotonSocketServer.exe` (reads config, binds 5055 Comm / 5155 Game, configurable slots).
- [ ] net8.0 retarget of the server (UnityEngine shim already netstandard-friendly; WCF web-service clients → `System.ServiceModel.Primitives`) for Linux ARM64/AMD64.
- [ ] Repatch the Unity client to load the `Photon3Unity3D` shim (via the `UniversalUnityPatcher` submodule).
- [ ] Multi-server / server-list support and publish bundles.
