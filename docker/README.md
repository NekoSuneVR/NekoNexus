# Running NekoNexus with Docker (amd64 + arm64)

Runs the **whole free stack** — MySQL, the Bun web services, and the LiteNetLib realtime
server (Comm + Game) — with **no Photon SDK, no licence, and a slot count you control**.

## Prerequisites

- Docker + Docker Compose v2.
- The `packages/Core` submodule must be checked out (it's needed to build the realtime):
  ```
  git submodule update --init packages/Core
  ```

## Quick start (your machine's architecture)

```
docker compose up --build
```

This brings up:

| Service | Ports | Notes |
|---|---|---|
| `db` (MariaDB) | internal 3306 | data persisted in the `db-data` volume |
| `webservices` (Bun) | 8080 SOAP, 8081 files, 8082 master-socket | reads `docker/config/NekoNexus.Settings.WebServices.yml` |
| `realtime-comm` | 5055/udp | lobby/chat |
| `realtime-game` | 5155/udp | gameplay |

Stop with `docker compose down` (add `-v` to also wipe the database).

## Setting the slot count

Slots are **not** licence-capped. Either:

- edit `MaxPlayerCount` in `docker/config/NekoNexus.Realtime.yml`, or
- pass a flag in `docker-compose.yml`, e.g. `command: ["Game", "--max-peers", "200"]`.

## Adding more servers (server list)

The in-game list is driven by the `ServerCredentials` registry in
`docker/config/NekoNexus.Settings.WebServices.yml`. To add another game server:

1. Add a new `ServerCredentials` entry (Type 3 = Game) with a fresh `Id` (GUID) + `Passphrase`.
2. Add a matching realtime service in `docker-compose.yml` (copy `realtime-game`, new UDP port)
   with its own `NekoNexus.Realtime.yml` whose `GameApplicationSettings.ApplicationIdentifier`
   and `EncryptionPassPhrase` match that entry.

## Building multi-arch images (amd64 + arm64)

The realtime image builds the .NET output once on the build host (portable IL) and runs it on
per-arch Mono, so cross-building is cheap:

```
# one-time: a builder that can target multiple platforms
docker buildx create --use --name nekonexus

# build (and optionally --push to a registry) for both architectures
docker buildx build --platform linux/amd64,linux/arm64 \
  -f docker/realtime.Dockerfile -t youruser/nekonexus-realtime:latest --push .

docker buildx build --platform linux/amd64,linux/arm64 \
  -f docker/webservices.Dockerfile -t youruser/nekonexus-webservices:latest --push .
```

(Multi-arch manifests must be pushed to a registry; local `--load` only supports a single arch.)

## Notes

- The realtime runs on **Mono** (the net481 build is portable as-is). A future native **.NET 8**
  build (task #9) will allow slimmer `mcr.microsoft.com/dotnet/runtime:8.0` images.
- First boot: the web service creates/seeds its schema in MySQL; give it a few seconds before
  connecting a client.
