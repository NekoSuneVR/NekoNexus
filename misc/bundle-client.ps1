<#
.SYNOPSIS
  Assembles the free-server client patch toolkit into
  .release/client/_pak/free-server/ (and a .zip). Run after building the patcher and
  the Photon3Unity3D shim.
#>
[CmdletBinding()]
param()
$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$Out      = Join-Path $RepoRoot ".release\client\_pak\free-server"
$PatchBin = Join-Path $RepoRoot "packages\Patcher\bin\Release"
$ShimDll  = Join-Path $RepoRoot "packages\Core\AssemblyReferences\Photon3Unity3D.dll"
$ModDir   = Join-Path $RepoRoot ".release\client\_pak\UberStrike_Data\Managed"

function Need($p,$w){ if(-not(Test-Path $p)){ throw "$w not found: $p (build it first)" } }
Need $PatchBin "UniversalUnityPatcher build"
Need $ShimDll  "Photon3Unity3D shim"

Write-Host "==> Assembling $Out" -ForegroundColor Cyan
if (Test-Path $Out) { Remove-Item $Out -Recurse -Force }
New-Item -ItemType Directory -Force -Path (Join-Path $Out "patcher") | Out-Null

# Patcher tool + its runtime deps
Copy-Item (Join-Path $PatchBin "*") (Join-Path $Out "patcher") -Recurse -Force
# Our free transport shim
Copy-Item $ShimDll (Join-Path $Out "Photon3Unity3D.dll") -Force

# Prebuilt Paradise client mod DLLs -> makes the zip SELF-CONTAINED (install-paradise.ps1 needs
# no repo/SDK). Only present after make-client-patch.ps1 has built the mod (needs game assemblies),
# so this is skipped in CI - there the zip ships the repo-based make-client-patch.ps1 instead.
$mods = @("Paradise.Client.Bootstrap.dll","Paradise.Client.dll","0Harmony.dll","log4net.dll","YamlDotNet.dll")
$haveMod = (Test-Path $ModDir) -and (Test-Path (Join-Path $ModDir "Paradise.Client.Bootstrap.dll"))
if ($haveMod) {
  New-Item -ItemType Directory -Force -Path (Join-Path $Out "mod") | Out-Null
  foreach ($m in $mods) { $src = Join-Path $ModDir $m; if (Test-Path $src) { Copy-Item $src (Join-Path $Out "mod") -Force } }
  # Discord Rich Presence helper (Windows-only) -> ships in plugins/ and lands in UberStrike_Data\Plugins.
  $rpcExe = Join-Path $RepoRoot ".release\client\_pak\UberStrike_Data\Plugins\Paradise.Client.DiscordRPC.exe"
  if (Test-Path $rpcExe) {
    New-Item -ItemType Directory -Force -Path (Join-Path $Out "plugins") | Out-Null
    Copy-Item $rpcExe (Join-Path $Out "plugins") -Force
    Write-Host "    + Discord Rich Presence helper (plugins\Paradise.Client.DiscordRPC.exe)" -ForegroundColor Green
  }
  Copy-Item (Join-Path $RepoRoot "packages\Client\install-paradise.ps1") $Out -Force
  Copy-Item (Join-Path $RepoRoot "packages\Client\paradise-target.json") $Out -Force
  Copy-Item (Join-Path $RepoRoot "packages\Client\Install.cmd")          $Out -Force
  Copy-Item (Join-Path $RepoRoot "packages\Client\INSTALL.md")           $Out -Force
  Write-Host "    + self-contained installer (double-click Install.cmd, Steam auto-detect)" -ForegroundColor Green
} else {
  Write-Host "    ! mod DLLs not built - zip will require a repo checkout (make-client-patch.ps1)" -ForegroundColor Yellow
}

# Patch definition, settings template, repo-based build script, README
Copy-Item (Join-Path $RepoRoot "packages\Client\Paradise.Patch.xml")                    $Out -Force
Copy-Item (Join-Path $RepoRoot "packages\Client\Paradise.Settings.Client.template.xml") $Out -Force
Copy-Item (Join-Path $RepoRoot "packages\Client\make-client-patch.ps1")                 $Out -Force
Copy-Item (Join-Path $RepoRoot "packages\Client\README.md")                             $Out -Force

$zip = Join-Path $RepoRoot ".release\client\Paradise-free-server-client.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $Out "*") -DestinationPath $zip -Force

Write-Host "==> Done." -ForegroundColor Green
Write-Host "    Folder: $Out"
Write-Host "    Zip:    $zip"
Get-ChildItem $Out -Recurse -File | ForEach-Object { "    " + $_.FullName.Substring($Out.Length+1) }
