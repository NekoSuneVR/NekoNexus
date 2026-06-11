@echo off
rem Double-click to open the NekoNexus Server Manager (GUI). No command line needed.
powershell -NoProfile -ExecutionPolicy Bypass -STA -WindowStyle Hidden -File "%~dp0NekoNexusServerManager.ps1"
