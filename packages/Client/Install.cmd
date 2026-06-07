@echo off
REM Paradise free-server patch - double-click installer.
REM Finds UberStrike from Steam and reads the server from paradise-target.json.
title Paradise - UberStrike patch
echo Installing the Paradise patch for UberStrike...
echo (Close UberStrike first if it is running.)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-paradise.ps1"
echo.
pause
