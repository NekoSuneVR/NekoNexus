<#
.SYNOPSIS
  Installs the Paradise free-server patch into an UberStrike install.
  SELF-CONTAINED: uses the prebuilt mod DLLs + transport shim shipped in this zip.
  No repo, no .NET SDK, no building required.

  ZERO-TYPING MODE: if you (the server owner) set your domain in paradise-target.json,
  end users can just double-click Install.cmd — the game is auto-found from Steam and the
  server is read from the config. No arguments needed.

.EXAMPLE
  # End user, zero-typing: just double-click Install.cmd (uses paradise-target.json + Steam auto-detect)

.EXAMPLE
  # Explicit:
  .\install-paradise.ps1 -ServerHost play.example.com -Https

.EXAMPLE
  # Game not in a standard Steam library? point at it:
  .\install-paradise.ps1 -UberStrikePath "D:\Games\UberStrike" -ServerHost play.example.com -Https
#>
[CmdletBinding()]
param(
  [string]$UberStrikePath,   # optional — auto-detected from Steam if omitted
  [string]$ServerHost,       # optional — read from paradise-target.json if omitted
  [int]$WebPort  = 8080,
  [int]$FilePort = 8081,
  [switch]$Https,
  [switch]$NoPatch
)
$ErrorActionPreference = "Stop"
function Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }
function Need($p, $what) { if (-not (Test-Path $p)) { throw "$what not found: $p" } }

$Here = $PSScriptRoot

# --- Find UberStrike via Steam (registry -> library folders -> common fallbacks) -----------
function Find-UberStrike {
  $libs = New-Object System.Collections.Generic.List[string]
  $steam = $null
  foreach ($k in @('HKCU:\Software\Valve\Steam', 'HKLM:\SOFTWARE\WOW6432Node\Valve\Steam', 'HKLM:\SOFTWARE\Valve\Steam')) {
    try {
      $p = Get-ItemProperty -Path $k -ErrorAction Stop
      if ($p.SteamPath) { $steam = $p.SteamPath } elseif ($p.InstallPath) { $steam = $p.InstallPath }
      if ($steam) { break }
    } catch { }
  }
  if ($steam) {
    $libs.Add($steam)
    $vdf = Join-Path $steam "steamapps\libraryfolders.vdf"
    if (Test-Path $vdf) {
      foreach ($m in [regex]::Matches((Get-Content $vdf -Raw), '"path"\s*"([^"]+)"')) {
        $libs.Add(($m.Groups[1].Value -replace '\\\\', '\'))
      }
    }
  }
  $libs.Add("C:\Program Files (x86)\Steam"); $libs.Add("C:\Program Files\Steam")
  foreach ($lib in ($libs | Select-Object -Unique)) {
    $g = Join-Path $lib "steamapps\common\UberStrike"
    if (Test-Path (Join-Path $g "UberStrike_Data\Managed\Assembly-CSharp.dll")) { return $g }
  }
  return $null
}

# --- Resolve target: command-line args win, else paradise-target.json -----------------------
$cfgFile = Join-Path $Here "paradise-target.json"
$cfg = $null
if (Test-Path $cfgFile) { try { $cfg = Get-Content $cfgFile -Raw | ConvertFrom-Json } catch { } }
function CfgHas($name) { return $cfg -and ($cfg.PSObject.Properties.Name -contains $name) }

if (-not $ServerHost -and (CfgHas 'ServerHost')) { $ServerHost = [string]$cfg.ServerHost }
if (-not $PSBoundParameters.ContainsKey('Https') -and (CfgHas 'Https'))   { if ([bool]$cfg.Https) { $Https = $true } }
if (-not $PSBoundParameters.ContainsKey('WebPort') -and (CfgHas 'WebPort'))   { $WebPort  = [int]$cfg.WebPort }
if (-not $PSBoundParameters.ContainsKey('FilePort') -and (CfgHas 'FilePort')) { $FilePort = [int]$cfg.FilePort }

if (-not $ServerHost -or $ServerHost -eq 'play.yourdomain.com') {
  throw "No server configured. Set ServerHost in paradise-target.json (or pass -ServerHost <host>)."
}

if (-not $UberStrikePath) {
  Step "Looking for UberStrike via Steam..."
  $UberStrikePath = Find-UberStrike
  if ($UberStrikePath) { Write-Host "    found: $UberStrikePath" -ForegroundColor Green }
}
if (-not $UberStrikePath) {
  throw "Couldn't find UberStrike automatically. Re-run with -UberStrikePath '<path to your UberStrike folder>'."
}

$Managed = Join-Path $UberStrikePath "UberStrike_Data\Managed"
$DataDir = Join-Path $UberStrikePath "UberStrike_Data"
Need $Managed "UberStrike Managed folder (check the path)"
Need (Join-Path $Managed "Assembly-CSharp.dll") "Assembly-CSharp.dll (is this an UberStrike install?)"

# Refuse to run while the game is open — a locked DLL silently half-installs (old transport
# stays, you get SocketException / 'Couldn't connect to server'). Close it first.
if (Get-Process UberStrike -ErrorAction SilentlyContinue) {
  throw "UberStrike is running. Close the game completely (and quit it in Steam), then re-run."
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

# 1) Install the prebuilt Paradise runtime + our free transport FIRST. The patch injects a Call
#    into Paradise.Client.Bootstrap, so that DLL MUST already be in Managed for the patcher to
#    resolve it - otherwise the patch fails (exit 1, stops at "patch method Awake").
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

# Optional plugins (Discord Rich Presence helper exe) -> UberStrike_Data\Plugins. The mod launches
# this as a child process; without it Discord Rich Presence silently does nothing.
$PluginsSrc = Join-Path $Here "plugins"
if (Test-Path $PluginsSrc) {
  $gamePlugins = Join-Path $DataDir "Plugins"
  New-Item -ItemType Directory -Force -Path $gamePlugins | Out-Null
  Get-ChildItem $PluginsSrc -File | ForEach-Object {
    Copy-Item $_.FullName $gamePlugins -Force
    Write-Host "    + Plugins\$($_.Name)"
  }
}

# 2) Patch Assembly-CSharp to load the bootstrap (now resolvable). Restore a clean copy from the
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
Write-Host "NOTE: if this game was patched before against a DIFFERENT server, the client keeps the old" -ForegroundColor Yellow
Write-Host "URL in saved settings. Change it in-game (Paradise Settings -> Web Service URLs), or clear it" -ForegroundColor Yellow
Write-Host "once:  Remove-Item 'HKCU:\Software\Cmune\UberStrike' -Recurse   (resets game prefs)." -ForegroundColor Yellow
