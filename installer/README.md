# NekoNexusSetup.exe — one-click UberStrike patch installer

A single native installer (Inno Setup) that auto-detects UberStrike from Steam and patches it
to play on the NekoNexus free server (`nekonexus.nekosunevr.co.uk`). No `.cmd`, no PowerShell,
no typing — the user just runs the EXE, clicks Next, done.

If the machine is missing **.NET Framework 4.7.2+** (the patcher's dependency — Windows 10/11
already have it), the installer **downloads and installs .NET 4.8 automatically** at the Ready
step (with a progress bar), then continues. Only users who lack .NET pay that one-time download.

## Build it
```powershell
# one-time: install the compiler (free)
winget install --id JRSoftware.InnoSetup -e
# build (bundles the toolkit, then compiles)
.\misc\build-installer.ps1
# output: .release\installer\NekoNexusSetup.exe
```
The prebuilt mod DLLs must exist first — run `packages\Client\make-client-patch.ps1` once against a
real UberStrike install (it builds them), or build on the `patcher` branch which ships them.

To re-target a different server, change `#define ServerHost` at the top of `nekonexus-setup.iss`.

## About antivirus / "virus safe"
**The honest picture:** any tool that modifies another program's files (game patching) can trip
*heuristic* antivirus, and an **unsigned** EXE makes Windows SmartScreen show
"Windows protected your PC — unknown publisher". That warning is about the *publisher being
unverified*, not malware. This installer is built with **Inno Setup**, which is the
*least* false-flagged option (PowerShell-to-EXE converters like PS2EXE are almost always flagged —
we deliberately avoid them).

**To make it truly warning-free you need to code-sign the EXE.** Options:
1. **Free for open-source** — [SignPath.io](https://signpath.io) grants free Authenticode signing to
   OSS projects (this repo is public and qualifies), or [Certum Open Source](https://www.certum.eu)
   (~$30/yr).
2. **Paid** — an OV/EV cert from Sectigo / DigiCert / SSL.com (~$100–400/yr). An **EV** cert gives
   instant SmartScreen reputation.

Once you have a cert, uncomment `SignTool=signtool` in `nekonexus-setup.iss` and register the tool:
```
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" /Ssigntool="signtool.exe sign /f mycert.pfx /p PWD /tr http://timestamp.digicert.com /td sha256 /fd sha256 $f" installer\nekonexus-setup.iss
```

**Until signed:** users click *More info → Run anyway* on the SmartScreen prompt. If a specific AV
false-flags it, submit it to that vendor for review — reputation builds with downloads over time.
Also: don't repack/obfuscate the EXE (Inno's default output is what AV engines trust).
