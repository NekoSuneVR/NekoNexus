<#
.SYNOPSIS
  Push the client auto-update payload to your server over SSH, so players receive it.
  Optionally publishes first (build + manifest) and recreates the web service container.

  Uses the OpenSSH client built into Windows 10/11 (scp/ssh). Auth uses your normal SSH key
  (or it'll prompt for a password). No credentials are stored in this repo.

.PARAMETER SshHost   Your server, e.g. 75.119.148.51 or nekonexus.nekosunevr.co.uk
.PARAMETER SshUser   SSH user (default: root)
.PARAMETER RemoteDir The folder on the server that contains docker-compose.yml
.PARAMETER Port      SSH port (default: 22)
.PARAMETER Publish   Build + stage + regenerate before syncing: stable | beta | none (default none)
.PARAMETER NoRestart Skip `docker compose up -d webservices` on the server after syncing.

.EXAMPLE
  # build the current code to beta, push it, and reload the web service:
  .\misc\sync-updates.ps1 -SshHost nekonexus.nekosunevr.co.uk -RemoteDir /opt/nekonexus -Publish beta

.EXAMPLE
  # just push whatever is already in server-data\updates:
  .\misc\sync-updates.ps1 -SshHost 75.119.148.51 -SshUser root -RemoteDir /opt/nekonexus
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$SshHost,
  [string]$SshUser = 'root',
  [Parameter(Mandatory)][string]$RemoteDir,
  [int]$Port = 22,
  [ValidateSet('stable', 'beta', 'none')][string]$Publish = 'none',
  [switch]$NoRestart
)
$ErrorActionPreference = 'Stop'
function Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }
$Repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Local = Join-Path $Repo 'server-data\updates'
$Target = "${SshUser}@${SshHost}"

# 0) Optionally build + stage + regenerate the manifest for a channel first.
if ($Publish -ne 'none') {
  & (Join-Path $PSScriptRoot 'publish-update.ps1') -Channel $Publish
}

if (-not (Test-Path $Local)) {
  throw "No update payload at $Local. Run misc\publish-update.ps1 first (or pass -Publish stable|beta)."
}

# 1) Make sure the remote folder exists, then copy server-data\updates -> <RemoteDir>/server-data/updates.
Step "Ensuring remote folder ($RemoteDir/server-data)"
& ssh -p $Port $Target "mkdir -p '$RemoteDir/server-data'"
if ($LASTEXITCODE -ne 0) { throw "ssh mkdir failed (check SshHost/SshUser/Port/key)." }

Step "Uploading update payload -> $Target:$RemoteDir/server-data/updates"
& scp -r -P $Port $Local "${Target}:$RemoteDir/server-data/"
if ($LASTEXITCODE -ne 0) { throw "scp upload failed." }

# 2) Recreate the web service so it serves the mounted ./server-data/updates (first time only;
#    after that the file server reads the folder live, but a reload is harmless).
if (-not $NoRestart) {
  Step "Reloading web service on the server"
  & ssh -p $Port $Target "cd '$RemoteDir' && (docker compose up -d webservices || docker-compose up -d webservices)"
  if ($LASTEXITCODE -ne 0) { Write-Host "    (could not reload remotely - run 'docker compose up -d webservices' on the server)" -ForegroundColor Yellow }
}

Write-Host ''
Write-Host "Synced. Verify:  curl https://$SshHost/updates/v2/stable/updates.yml" -ForegroundColor Green
Write-Host "Players with Auto-Updates on get it on next launch."
