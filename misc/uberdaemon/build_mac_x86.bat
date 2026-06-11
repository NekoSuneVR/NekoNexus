@echo off

set GOOS=darwin
set GOARCH=386

echo Building uberdaemon for %GOOS%-%GOARCH%...

go build -o build\uberdaemon_nekonexus src\uberdaemon.go

pause