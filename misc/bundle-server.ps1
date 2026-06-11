<#
.SYNOPSIS
  Assembles a click-and-run Windows server package into .release/server/_pak:
  the standalone Web Services exe (+ config + wwwroot), the Realtime Host exe
  (Comm + Game), config files, and a start-server.bat.

  Build the pieces first:
    bun run build:shims ; bun run build:host       (realtime)
    bun --cwd packages/ws run build:win-x64        (web services exe)
#>
[CmdletBinding()]
param()
$ErrorActionPreference = "Stop"
$Repo = Resolve-Path (Join-Path $PSScriptRoot "..")
$Pak  = Join-Path $Repo ".release\server\_pak"
$WsOut   = Join-Path $Pak "NekoNexus.WebServices"
$RtBin   = Join-Path $Pak "NekoNexus.Realtime\bin"

function Need($p,$w){ if(-not(Test-Path $p)){ throw "$w not found: $p (build it first)" } }
Need (Join-Path $WsOut "NekoNexus.WebServices_x64.exe") "Web Services exe"
Need (Join-Path $RtBin "NekoNexus.Realtime.Host.exe") "Realtime Host exe"

Write-Host "==> Staging web service config + wwwroot" -ForegroundColor Cyan
Copy-Item (Join-Path $Repo "packages\ws\NekoNexus.Settings.WebServices.yml") $WsOut -Force
Copy-Item (Join-Path $Repo "packages\ws\wwwroot") $WsOut -Recurse -Force

Write-Host "==> Writing start-server.bat" -ForegroundColor Cyan
$bat = @'
@echo off
title NekoNexus Server Launcher
echo Starting NekoNexus (Web Services + Comm + Game)...
echo Make sure MySQL/MariaDB is running and configured in
echo   NekoNexus.WebServices\NekoNexus.Settings.WebServices.yml
echo.
start "NekoNexus Web Services" /D "%~dp0NekoNexus.WebServices" "%~dp0NekoNexus.WebServices\NekoNexus.WebServices_x64.exe"
timeout /t 3 /nobreak >nul
start "NekoNexus Comm" /D "%~dp0NekoNexus.Realtime\bin" "%~dp0NekoNexus.Realtime\bin\NekoNexus.Realtime.Host.exe" Comm
start "NekoNexus Game" /D "%~dp0NekoNexus.Realtime\bin" "%~dp0NekoNexus.Realtime\bin\NekoNexus.Realtime.Host.exe" Game
if exist "%~dp0NekoNexus.Admin\NekoNexus.Admin_x64.exe" start "NekoNexus Admin" /D "%~dp0NekoNexus.Admin" "%~dp0NekoNexus.Admin\NekoNexus.Admin_x64.exe"
echo.
echo Admin dashboard (if installed): http://localhost:8088   (login admin / admin)
echo Three windows opened. Close them to stop the server.
pause
'@
Set-Content -Path (Join-Path $Pak "start-server.bat") -Value $bat -Encoding ascii

Write-Host "==> Writing SERVER-SETUP.txt" -ForegroundColor Cyan
Copy-Item (Join-Path $Repo "misc\SERVER-SETUP.txt") (Join-Path $Pak "SERVER-SETUP.txt") -Force -ErrorAction SilentlyContinue

Write-Host "==> Adding Server Manager GUI (one-click config + run)" -ForegroundColor Cyan
Copy-Item (Join-Path $Repo "misc\server-manager\*") $Pak -Force

# Admin dashboard exe (optional component) is staged if it's been built.
$AdminExe = Join-Path $Pak "NekoNexus.Admin\NekoNexus.Admin_x64.exe"
if (Test-Path $AdminExe) { Write-Host "==> Admin dashboard exe present" -ForegroundColor Cyan }

$zip = Join-Path $Repo ".release\server\NekoNexus-server-win-x64.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Write-Host "==> Zipping -> $zip" -ForegroundColor Cyan
Compress-Archive -Path (Join-Path $Pak "*") -DestinationPath $zip -Force

Write-Host "==> Done." -ForegroundColor Green
Write-Host "    Folder: $Pak"
Write-Host "    Zip:    $zip"