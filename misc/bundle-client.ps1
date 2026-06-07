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
# Patch definition, settings template, automation script, README
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
