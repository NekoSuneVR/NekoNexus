#!/usr/bin/env bash
# Launches the free Paradise realtime server: one process for Comm, one for Game.
# Comm and Game MUST be separate processes (Paradise uses a per-application singleton).
#
# Usage: ./run-server.sh [bin-dir] [--max-peers N]
#   bin-dir defaults to the folder containing Paradise.Realtime.Host(.exe).
#
# On Linux/macOS this runs the host via the dotnet/mono runtime if needed; on a
# self-contained build just run the native Paradise.Realtime.Host binary directly.
set -euo pipefail

BIN_DIR="${1:-$(cd "$(dirname "$0")" && pwd)}"
shift || true
EXTRA_ARGS=("$@")

HOST="$BIN_DIR/Paradise.Realtime.Host"
[ -f "$HOST.exe" ] && HOST="$HOST.exe"

run() {
  local app="$1"
  echo "[run-server] starting $app ..."
  if [[ "$HOST" == *.exe ]] && ! [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    # .NET Framework exe on Linux/macOS -> run under Mono
    mono "$HOST" "$app" "${EXTRA_ARGS[@]}" &
  else
    "$HOST" "$app" "${EXTRA_ARGS[@]}" &
  fi
}

trap 'echo "[run-server] stopping..."; kill 0' SIGINT SIGTERM
run Comm
run Game
wait
