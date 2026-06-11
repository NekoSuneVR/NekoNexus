<#
.SYNOPSIS
  Publish a NekoNexus client update to a channel (beta or stable). Builds the mod + transport
  shim, stages the DLLs into the update tree, and regenerates the manifest the in-game
  auto-updater reads. Players on that channel with Auto-Updates on get the new files on launch.

  The webservices container serves the result via the ./server-data/updates volume (see
  docker-compose.yml). Publishing on the host updates the live server with no rebuild/restart.

.EXAMPLE
  .\misc\publish-update.ps1 -Channel beta     # push the current build to beta testers
  .\misc\publish-update.ps1 -Channel stable   # promote it to everyone

.NOTES
  Workflow: land your fixes on dev -> .\misc\publish-update.ps1 -Channel beta -> test in-game on
  the Beta channel -> when happy, .\misc\publish-update.ps1 -Channel stable.
#>
[CmdletBinding()]
param(
  [ValidateSet('stable', 'beta')][string]$Channel = 'beta'
)
$ErrorActionPreference = 'Stop'
function Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }
$Repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

# 1) Build the free transport shim + the client mod (latest source).
Step 'Building transport shim + client mod'
dotnet build (Join-Path $Repo 'shims\Photon3Unity3D.Shim\Photon3Unity3D.Shim.csproj') -c Release | Out-Null
dotnet build (Join-Path $Repo 'packages\Client\Current\NekoNexus.Client.Bootstrap\NekoNexus.Client.Bootstrap.csproj') -c Release | Out-Null
dotnet build (Join-Path $Repo 'packages\Client\Current\NekoNexus.Client\NekoNexus.Client.csproj') -c Release | Out-Null
dotnet build (Join-Path $Repo 'packages\Client\Current\NekoNexus.Client.DiscordRPC\NekoNexus.Client.DiscordRPC.csproj') -c Release | Out-Null

# 2) Stage the files the client should receive, matching the in-game folder layout.
$ModSrc = Join-Path $Repo '.release\client\_pak\UberStrike_Data\Managed'
$Shim   = Join-Path $Repo 'packages\Core\AssemblyReferences\Photon3Unity3D.dll'
$Base   = Join-Path $Repo 'server-data'
$Dest   = Join-Path $Base "updates\v2\$Channel\universal\UberStrike_Data\Managed"
Step "Staging update files -> $Channel"
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
foreach ($f in 'NekoNexus.Client.Bootstrap.dll', 'NekoNexus.Client.dll', '0Harmony.dll', 'log4net.dll', 'YamlDotNet.dll') {
  Copy-Item (Join-Path $ModSrc $f) $Dest -Force
  Write-Host "    + $f"
}
Copy-Item $Shim (Join-Path $Dest 'Photon3Unity3D.dll') -Force
Write-Host '    + Photon3Unity3D.dll'

# Discord Rich Presence helper is Windows-only -> goes in the 'win' platform tree and lands in
# UberStrike_Data\Plugins on the client. The manifest marks it optional, so the auto-updater keeps
# it fresh when present (the installer is what first puts it there).
$RpcExe  = Join-Path $Repo '.release\client\_pak\UberStrike_Data\Plugins\NekoNexus.Client.DiscordRPC.exe'
if (Test-Path $RpcExe) {
  $RpcDest = Join-Path $Base "updates\v2\$Channel\win\UberStrike_Data\Plugins"
  New-Item -ItemType Directory -Force -Path $RpcDest | Out-Null
  Copy-Item $RpcExe $RpcDest -Force
  Write-Host '    + NekoNexus.Client.DiscordRPC.exe (win)'
}

# 3) Regenerate the manifest (hashes every file in every channel that exists under server-data).
Step "Generating update manifest"
Push-Location (Join-Path $Repo 'packages\ws')
try { & bun src/index.ts gen-updates --dir $Base } finally { Pop-Location }

Write-Host ''
Write-Host "Published to '$Channel'." -ForegroundColor Green
Write-Host "  manifest: $Base\updates\v2\$Channel\updates.yml"
Write-Host "  served at: <your-domain>/updates/v2/$Channel/updates.yml (via the server-data volume)"
Write-Host "Players on the '$Channel' channel with Auto-Updates enabled get it on next launch."
