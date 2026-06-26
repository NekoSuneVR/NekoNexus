<#
.SYNOPSIS
  Publish the built update channel (server-data/updates/v2) + the one-click installer to the
  `updates` orphan branch, which GitHub Pages (or raw.githubusercontent) serves globally. The
  in-game auto-updater can then point at https://<user>.github.io/<repo>/ with endpoint /  (the
  catalog lives at /v2/<channel>/updates.yml).

  Idempotent and safe: it uses a throwaway git worktree, never touches your current branch/working
  tree, and force-replaces the branch contents with the freshly built channel.

.NOTES
  Auth: relies on the ambient git credentials (locally: your push access; in GitHub Actions: the
  checkout's GITHUB_TOKEN). Run misc/publish-update.ps1 first to build + stage the channel.
#>
[CmdletBinding()]
param(
  [string]$Branch = 'updates'
)
$ErrorActionPreference = 'Stop'
function Step($m) { Write-Host "==> $m" -ForegroundColor Cyan }
$Repo   = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Src    = Join-Path $Repo 'server-data\updates'
$Setup  = Join-Path $Repo '.release\installer\NekoNexusSetup.exe'

if (-not (Test-Path (Join-Path $Src 'v2'))) {
  throw "No built channel at $Src\v2. Run misc\publish-update.ps1 first."
}

$work = Join-Path ([System.IO.Path]::GetTempPath()) ("nekonexus-updates-" + [System.Guid]::NewGuid().ToString('N').Substring(0, 8))

try {
  Push-Location $Repo

  # Does the branch already exist on the remote?
  $remoteHas = -not [string]::IsNullOrWhiteSpace((git ls-remote --heads origin $Branch | Out-String))

  Step "Preparing worktree for '$Branch'"
  if ($remoteHas) {
    git fetch origin $Branch --depth 1 2>$null | Out-Null
    git worktree add --force $work "origin/$Branch" | Out-Null
    Push-Location $work
    git switch -C $Branch | Out-Null
    Pop-Location
  } else {
    # Fresh orphan branch with no history.
    git worktree add --force --detach $work | Out-Null
    Push-Location $work
    git checkout --orphan $Branch | Out-Null
    git rm -rf . 2>$null | Out-Null
    Pop-Location
  }

  Step 'Replacing channel contents'
  # Wipe everything except .git, then copy the fresh channel to the branch root so URLs are
  # /v2/<channel>/...  (clean for GitHub Pages).
  Get-ChildItem -Path $work -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
  Copy-Item (Join-Path $Src '*') $work -Recurse -Force

  if (Test-Path $Setup) {
    Copy-Item $Setup (Join-Path $work 'NekoNexusSetup.exe') -Force
    Write-Host '    + NekoNexusSetup.exe (one-click installer, downloadable)'
  }

  # A .nojekyll file so GitHub Pages serves files/dirs starting with _ or . verbatim and doesn't
  # run Jekyll over the binary tree.
  New-Item -ItemType File -Force -Path (Join-Path $work '.nojekyll') | Out-Null
  # The Pages root has no real homepage (the channel lives under /v2/...), so redirect visitors to
  # the main site. The update catalog (/v2/<channel>/updates.yml) and the installer
  # (/NekoNexusSetup.exe) are direct paths and are unaffected by this root redirect.
  $redirect = @'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=https://paradise.nekosunevr.co.uk/">
<link rel="canonical" href="https://paradise.nekosunevr.co.uk/">
<title>NekoNexus</title>
<script>location.replace("https://paradise.nekosunevr.co.uk/");</script>
</head>
<body>Redirecting to <a href="https://paradise.nekosunevr.co.uk/">paradise.nekosunevr.co.uk</a>…</body>
</html>
'@
  [System.IO.File]::WriteAllText((Join-Path $work 'index.html'), $redirect)

  Step 'Committing + pushing'
  Push-Location $work
  git add -A | Out-Null
  $stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  # Only commit if something changed.
  $pending = git status --porcelain
  if ($pending) {
    git -c user.name='nekonexus-ci' -c user.email='ci@nekonexus' commit -m "Publish client update channel ($stamp)" | Out-Null
    git push --force origin $Branch | Out-Null
    Write-Host "    pushed to origin/$Branch" -ForegroundColor Green
  } else {
    Write-Host '    no changes to publish' -ForegroundColor Yellow
  }
  Pop-Location
} finally {
  Pop-Location -ErrorAction SilentlyContinue
  # Always clean up the worktree registration + temp dir.
  if (Test-Path $work) {
    git -C $Repo worktree remove --force $work 2>$null | Out-Null
    if (Test-Path $work) { Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue }
  }
}

Write-Host ''
Write-Host "Published to the '$Branch' branch." -ForegroundColor Green
Write-Host "Enable GitHub Pages: Settings -> Pages -> Source: branch '$Branch' / root."
Write-Host "In-game updater: set Web Service URL host to https://<user>.github.io/<repo> (endpoint '/'),"
Write-Host "  catalog resolves to /v2/<channel>/updates.yml."
