# syntax=docker/dockerfile:1

# ---- build stage --------------------------------------------------------------
# Built on the BUILD platform (native, fast). The output is portable AnyCPU IL,
# so the same binaries run on both amd64 and arm64 Mono runtimes below.
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore-friendly: copy everything (Core submodule must be checked out on the host:
#   git submodule update --init packages/Core
COPY . .

# Build the free shims first (they drop DLLs into packages/AssemblyReferences that the
# realtime references by HintPath), then the realtime + self-host launcher.
RUN dotnet build shims/UnityEngine.Shim/UnityEngine.Shim.csproj -c Release \
 && dotnet build shims/PhotonHostRuntimeInterfaces.Shim/PhotonHostRuntimeInterfaces.Shim.csproj -c Release \
 && dotnet build shims/Photon.SocketServer.Shim/Photon.SocketServer.Shim.csproj -c Release \
 && dotnet build shims/Photon3Unity3D.Shim/Photon3Unity3D.Shim.csproj -c Release \
 && dotnet build packages/Realtime/Paradise.Realtime.Host/Paradise.Realtime.Host.csproj -c Release

# ---- runtime stage ------------------------------------------------------------
# debian:12-slim + mono-complete is multi-arch (amd64 + arm64) and runs the net481
# realtime build (incl. WCF / System.ServiceModel for web-service auth).
FROM debian:12-slim AS runtime
RUN apt-get update \
 && apt-get install -y --no-install-recommends mono-complete ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /src/.release/server/_pak/Paradise.Realtime/bin/   ./bin/
COPY --from=build /src/.release/server/_pak/Paradise.Realtime/photon/ ./photon/

WORKDIR /app/bin
# UDP: Comm 5055, Game 5155 (the compose file maps the right one per service).
# The app to run (Comm/Game) plus any flags (e.g. --max-peers 200) come from CMD.
ENTRYPOINT ["mono", "Paradise.Realtime.Host.exe"]
CMD ["Game"]
