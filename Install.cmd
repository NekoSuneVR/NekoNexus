@echo off
REM NekoNexus free-server patch - double-click installer.
REM Finds UberStrike from Steam and reads the server from nekonexus-target.json.
title NekoNexus - UberStrike patch
echo Installing the NekoNexus patch for UberStrike...
echo (Close UberStrike first if it is running.)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-nekonexus.ps1"
echo.
pause
