# Launches the free NekoNexus realtime server on Windows: one process for Comm, one for Game.
# Usage: .\run-server.ps1 [-BinDir <dir>] [-MaxPeers <N>]
param(
    [string]$BinDir = $PSScriptRoot,
    [int]$MaxPeers = 0
)

$host_exe = Join-Path $BinDir "NekoNexus.Realtime.Host.exe"
if (-not (Test-Path $host_exe)) {
    Write-Error "NekoNexus.Realtime.Host.exe not found in $BinDir. Build it first or pass -BinDir."
    exit 1
}

$extra = @()
if ($MaxPeers -gt 0) { $extra = @("--max-peers", "$MaxPeers") }

Write-Host "[run-server] starting Comm + Game from $BinDir"
$comm = Start-Process -FilePath $host_exe -ArgumentList (@("Comm") + $extra) -WorkingDirectory $BinDir -PassThru
$game = Start-Process -FilePath $host_exe -ArgumentList (@("Game") + $extra) -WorkingDirectory $BinDir -PassThru

Write-Host "[run-server] Comm PID $($comm.Id), Game PID $($game.Id). Ctrl+C to stop."
try {
    Wait-Process -Id $comm.Id, $game.Id
} finally {
    foreach ($p in @($comm, $game)) { if ($p -and -not $p.HasExited) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } }
}
