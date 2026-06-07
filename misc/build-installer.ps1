<#
.SYNOPSIS
  Builds ParadiseSetup.exe — the one-click UberStrike patch installer.
  Bundles the self-contained client toolkit, then compiles the Inno Setup script.

.NOTES
  Needs Inno Setup 6 (free):  winget install --id JRSoftware.InnoSetup -e
  The prebuilt mod DLLs must already exist (run packages\Client\make-client-patch.ps1 once
  against a real UberStrike install, OR build on the `patcher` branch which ships them).
#>
[CmdletBinding()]
param()
$ErrorActionPreference = "Stop"
$Repo = Resolve-Path (Join-Path $PSScriptRoot "..")

# 1) Assemble the self-contained toolkit (patcher + prebuilt mod DLLs + shim + config).
& (Join-Path $Repo "misc\bundle-client.ps1")

if (-not (Test-Path (Join-Path $Repo ".release\client\_pak\free-server\mod\Paradise.Client.Bootstrap.dll"))) {
  throw "Prebuilt mod DLLs missing. Run packages\Client\make-client-patch.ps1 against your UberStrike once, then re-run."
}

# 2) Locate the Inno Setup compiler.
$iscc = @(
  "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
  "C:\Program Files\Inno Setup 6\ISCC.exe",
  (Join-Path $env:LOCALAPPDATA "Programs\Inno Setup 6\ISCC.exe")
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $iscc) { throw "Inno Setup not found. Install it:  winget install --id JRSoftware.InnoSetup -e" }

# 3) Compile.
& $iscc (Join-Path $Repo "installer\paradise-setup.iss")
$exe = Join-Path $Repo ".release\installer\ParadiseSetup.exe"
if (Test-Path $exe) {
  Write-Host "==> Built: $exe" -ForegroundColor Green
  Write-Host "    (Unsigned — Windows SmartScreen will warn until code-signed. See installer\README.md.)"
} else {
  throw "Compile finished but ParadiseSetup.exe not found."
}
