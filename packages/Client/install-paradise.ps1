<#
.SYNOPSIS
  Installs the Paradise free-server patch into an UberStrike install.
  SELF-CONTAINED: uses the prebuilt mod DLLs + transport shim shipped in this zip.
  No repo, no .NET SDK, no building required — just this folder and your game.

.EXAMPLE
  .\install-paradise.ps1 -UberStrikePath "C:\Program Files (x86)\Steam\steamapps\common\UberStrike" -ServerHost play.example.com -Https

.EXAMPLE
  # plain IP + ports (no HTTPS domain / reverse proxy):
  .\install-paradise.ps1 -UberStrikePath "C:\...\UberStrike" -ServerHost 203.0.113.10
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$UberStrikePath,
  [Parameter(Mandatory)][string]$ServerHost,
  [int]$WebPort = 8080,
  [int]$FilePort = 8081,
  # Use this when the server is behind ONE HTTPS domain (reverse proxy): the client uses
  # https://<ServerHost>/2.0, /images, /updates (no ports).
  [switch]$Https,
  [switch]$NoPatch
)
$ErrorActionPreference = "Stop"
function Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }
function Need($p, $what) { if (-not (Test-Path $p)) { throw "$what not found: $p" } }

$Here    = $PSScriptRoot
$Managed = Join-Path $UberStrikePath "UberStrike_Data\Managed"
$DataDir = Join-Path $UberStrikePath "UberStrike_Data"

Need $Managed "UberStrike Managed folder (check -UberStrikePath)"
Need (Join-Path $Managed "Assembly-CSharp.dll") "Assembly-CSharp.dll (is this an UberStrike install?)"

# Refuse to run while the game is open — a locked DLL silently half-installs (old transport
# stays, you get SocketException / 'Couldn't connect to server'). Close it first.
if (Get-Process UberStrike -ErrorAction SilentlyContinue) {
  throw "UberStrike is running. Close the game completely (and quit it from Steam), then re-run."
}

# Bundled payload that ships in this zip.
$PatcherExe = Join-Path $Here "patcher\UniversalUnityPatcher.exe"
$PatchXml   = Join-Path $Here "Paradise.Patch.xml"
$ShimDll    = Join-Path $Here "Photon3Unity3D.dll"
$ModDir     = Join-Path $Here "mod"
Need $PatcherExe "patcher (UniversalUnityPatcher.exe)"
Need $PatchXml   "Paradise.Patch.xml"
Need $ShimDll    "Photon3Unity3D.dll (free transport shim)"
Need $ModDir     "mod\ folder (prebuilt Paradise DLLs)"

# 1) Patch Assembly-CSharp to load the Paradise bootstrap. Restore a clean copy from the
#    backup first so re-running is safe (re-patching an already-patched DLL crashes).
if (-not $NoPatch) {
  $backupDll = Join-Path $Managed "backup\Assembly-CSharp.dll"
  if (Test-Path $backupDll) {
    Copy-Item $backupDll (Join-Path $Managed "Assembly-CSharp.dll") -Force
    Write-Host "    restored clean Assembly-CSharp.dll from backup before patching"
  }
  Step "Patching Assembly-CSharp.dll (a backup is kept in Managed\backup)"
  $pargs = @("--backup", "--no-gui", "--silent", "--ignore-duplicate-patch", "-i", "`"$Managed`"", "-p", "`"$PatchXml`"")
  $p = Start-Process -FilePath $PatcherExe -ArgumentList $pargs -NoNewWindow -Wait -PassThru
  if ($p.ExitCode -ne 0) { throw "UniversalUnityPatcher failed (exit $($p.ExitCode)). Is this an unmodified, supported UberStrike build?" }
}

# 2) Install the prebuilt Paradise runtime + our free transport.
Step "Installing Paradise runtime + free transport into the game"
Get-ChildItem $ModDir -File | ForEach-Object {
  Copy-Item $_.FullName $Managed -Force
  Write-Host "    + $($_.Name)"
}
# Our free Photon3Unity3D.dll REPLACES the game's Photon transport (back the original up once).
$gamePhoton = Join-Path $Managed "Photon3Unity3D.dll"
if ((Test-Path $gamePhoton) -and -not (Test-Path "$gamePhoton.orig")) { Copy-Item $gamePhoton "$gamePhoton.orig" -Force }
Copy-Item $ShimDll $gamePhoton -Force
Write-Host "    + Photon3Unity3D.dll (free LiteNetLib transport)"

# 3) Write the settings file pointing at the server.
if ($Https) { $webBase = "https://$ServerHost"; $fileBase = "https://$ServerHost" }
else        { $webBase = "http://${ServerHost}:${WebPort}"; $fileBase = "http://${ServerHost}:${FilePort}" }
Step "Writing Paradise.Settings.Client.xml -> $webBase"
$tpl = Get-Content (Join-Path $Here "Paradise.Settings.Client.template.xml") -Raw
$tpl = $tpl -replace 'http://SERVER_HOST:8080/2\.0/', "$webBase/2.0/" `
            -replace 'http://SERVER_HOST:8081/images/', "$fileBase/images/" `
            -replace 'http://SERVER_HOST:8081/updates/', "$fileBase/updates/"
Set-Content -Path (Join-Path $DataDir "Paradise.Settings.Client.xml") -Value $tpl -Encoding UTF8

Write-Host ""
Write-Host "Done! UberStrike is patched for the Paradise server at $webBase." -ForegroundColor Green
Write-Host "Launch the game. You can add/switch servers in-game via Paradise Settings -> Web Service URLs."
Write-Host ""
Write-Host "NOTE: if you patched this game before against a DIFFERENT server, the client keeps the" -ForegroundColor Yellow
Write-Host "old URL in saved settings. Either change it in-game (Paradise Settings -> Web Service URLs)," -ForegroundColor Yellow
Write-Host "or clear it once:  Remove-Item 'HKCU:\Software\Cmune\UberStrike' -Recurse   (resets game prefs)." -ForegroundColor Yellow
