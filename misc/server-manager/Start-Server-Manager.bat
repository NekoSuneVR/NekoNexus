@echo off
rem Double-click to open the Paradise Server Manager (GUI). No command line needed.
powershell -NoProfile -ExecutionPolicy Bypass -STA -WindowStyle Hidden -File "%~dp0ParadiseServerManager.ps1"
