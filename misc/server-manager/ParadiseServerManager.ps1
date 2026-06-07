<#
  Paradise Server Manager — a tiny GUI to configure and run the whole server
  (Web Services + Comm + Game) with one click. No command line needed.

  Lives in the server package root, next to:
     Paradise.WebServices\Paradise.WebServices_x64.exe
     Paradise.Realtime\bin\Paradise.Realtime.Host.exe
  Edit MySQL / players / server name, hit Save, hit Start.
#>
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$Root    = Split-Path -Parent $MyInvocation.MyCommand.Path
$WsDir   = Join-Path $Root "Paradise.WebServices"
$RtBin   = Join-Path $Root "Paradise.Realtime\bin"
$WsExe   = Join-Path $WsDir "Paradise.WebServices_x64.exe"
$RtExe   = Join-Path $RtBin "Paradise.Realtime.Host.exe"
$StateFile = Join-Path $Root "server-config.json"

# Fixed identities (kept matched between web service + realtime automatically).
$COMM_ID = '11111111-1111-1111-1111-111111111111'; $COMM_PASS = 'paradise-comm-secret'
$GAME_ID = '22222222-2222-2222-2222-222222222222'; $GAME_PASS = 'paradise-game-secret'

# ---- config model ----------------------------------------------------------
function Get-DefaultConfig {
  [pscustomobject]@{
    ServerName = 'My Paradise Server'
    MaxPlayers = 100
    MasterHost = '127.0.0.1'
    DbHost = '127.0.0.1'; DbPort = 3306; DbUser = 'paradise'; DbPass = 'paradise'; DbName = 'paradise'
  }
}
function Load-Config {
  if (Test-Path $StateFile) {
    try { return (Get-Content $StateFile -Raw | ConvertFrom-Json) } catch {}
  }
  return Get-DefaultConfig
}
function Save-Config($cfg) {
  $cfg | ConvertTo-Json | Set-Content -Path $StateFile -Encoding UTF8
  Write-Ymls $cfg
}

# ---- write the two component ymls from the simple config -------------------
function Write-Ymls($cfg) {
  $ws = @"
Hostname: '0.0.0.0'
WebServicePort: 8080
FileServerPort: 8081
SocketPort: 8082
DatabaseSettings:
  Server: '$($cfg.DbHost)'
  Type: 'mysql'
  Port: $($cfg.DbPort)
  Username: '$($cfg.DbUser)'
  Password: '$($cfg.DbPass)'
  DatabaseName: '$($cfg.DbName)'
WebServicePrefix: 'UberStrike.DataCenter.WebService.CWS.'
WebServiceSuffix: 'Contract.svc'
EncryptionInitVector: 'aaaaBBBBccccDDDD'
EncryptionPassPhtase: 'mysupersecretkey'
ServerCredentials:
  - Name: '$($cfg.ServerName)'
    Type: 2
    Id: '$COMM_ID'
    Passphrase: '$COMM_PASS'
  - Name: '$($cfg.ServerName)'
    Type: 3
    Id: '$GAME_ID'
    Passphrase: '$GAME_PASS'
PluginBlacklist:
  -
FileServerRoot: 'wwwroot'
EnableSSL: false
SSLCertificateName: ''
DiscordSettings:
  Enabled: false
  BotToken: ''
  Integrations:
    LobbyChat: false
    RoomChats: false
    Commands: false
    PlayerJoinAnnouncements: false
    PlayerLeaveAnnouncements: false
    RoomOpenAnnouncements: false
    RoomCloseAnnouncements: false
    RoundStartAnnouncements: false
    RoundEndAnnouncements: false
    ErrorLog: false
  GuildId: ''
  ChatChannelId: ''
  CommandChannelId: ''
  RoomChatCategory: ''
  WebHooks:
    LobbyChat: ''
    PlayerAnnouncements: ''
    RoomAnnouncements: ''
    RoundAnnouncements: ''
    ErrorLog: ''
  AnnouncementBlacklist:
    -
"@
  $rt = @"
MasterHostname: '$($cfg.MasterHost)'
WebServicePort: 8080
FileServerPort: 8081
SocketPort: 8082
WebServiceEndpoint: '/2.0'
WebServicePrefix: 'UberStrike.DataCenter.WebService.CWS.'
WebServiceSuffix: 'Contract.svc'
WebServiceUseTLS: false
CommApplicationSettings:
  ApplicationIdentifier: '$COMM_ID'
  PhotonId: 1
  EncryptionPassPhrase: '$COMM_PASS'
  MaxPlayerCount: $($cfg.MaxPlayers)
GameApplicationSettings:
  ApplicationIdentifier: '$GAME_ID'
  PhotonId: 2
  EncryptionPassPhrase: '$GAME_PASS'
  MaxPlayerCount: $($cfg.MaxPlayers)
EnableChatLog: true
HeartbeatInterval: 5
HeartbeatTimeout: 5
EnableHashVerification: false
CompositeHashes:
  -
JunkHashes:
  -
GameplaySettings:
  MatchCountdownTime: 5
  PlayerRespawnTime: 5
  AllowFriendlyFire: false
  MatchEndTimeout: 3
"@
  if (Test-Path $WsDir) { Set-Content -Path (Join-Path $WsDir "Paradise.Settings.WebServices.yml") -Value $ws -Encoding UTF8 }
  if (Test-Path $RtBin) { Set-Content -Path (Join-Path $RtBin "Paradise.Realtime.yml") -Value $rt -Encoding UTF8 }
}

# ---- process control -------------------------------------------------------
$script:Procs = @{}
function Start-All($cfg) {
  Save-Config $cfg
  Stop-All
  if (-not (Test-Path $WsExe)) { Log "ERROR: missing $WsExe"; return }
  if (-not (Test-Path $RtExe)) { Log "ERROR: missing $RtExe"; return }
  $script:Procs['Web']  = Start-Process -FilePath $WsExe -WorkingDirectory $WsDir -PassThru
  Start-Sleep -Milliseconds 1500
  $script:Procs['Comm'] = Start-Process -FilePath $RtExe -ArgumentList @('Comm','--master-host',$cfg.MasterHost) -WorkingDirectory $RtBin -PassThru
  $script:Procs['Game'] = Start-Process -FilePath $RtExe -ArgumentList @('Game','--master-host',$cfg.MasterHost) -WorkingDirectory $RtBin -PassThru
  Log "Started: Web (PID $($script:Procs['Web'].Id)), Comm (PID $($script:Procs['Comm'].Id)), Game (PID $($script:Procs['Game'].Id))"
}
function Stop-All {
  foreach ($k in @($script:Procs.Keys)) {
    $p = $script:Procs[$k]
    if ($p -and -not $p.HasExited) { try { Stop-Process -Id $p.Id -Force -ErrorAction Stop; Log "Stopped $k" } catch {} }
  }
  $script:Procs = @{}
}
function Seed-Database($cfg) {
  Save-Config $cfg
  if (-not (Test-Path $WsExe)) { Log "ERROR: missing $WsExe"; return }
  Log "Initializing database (creates tables + default data)..."
  [Windows.Forms.Application]::DoEvents()
  $p = Start-Process -FilePath $WsExe -ArgumentList @('seed') -WorkingDirectory $WsDir -NoNewWindow -PassThru -Wait
  if ($p.ExitCode -eq 0) { Log "Database initialized OK. You can Start the server now." }
  else { Log "Seed failed (exit $($p.ExitCode)). Check the DB host/user/password above." }
}

# ---- GUI -------------------------------------------------------------------
$cfg = Load-Config
$form = New-Object Windows.Forms.Form
$form.Text = "Paradise Server Manager"
$form.Size = New-Object Drawing.Size(440, 620)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedSingle"; $form.MaximizeBox = $false

$y = 12
function Add-Label($text, $top) { $l = New-Object Windows.Forms.Label; $l.Text=$text; $l.Left=14; $l.Top=$top; $l.Width=150; $form.Controls.Add($l); $l }
function Add-Box($value, $top) { $t = New-Object Windows.Forms.TextBox; $t.Left=170; $t.Top=($top-3); $t.Width=240; $t.Text=[string]$value; $form.Controls.Add($t); $t }
function Add-Header($text, $top) { $l = New-Object Windows.Forms.Label; $l.Text=$text; $l.Left=10; $l.Top=$top; $l.Width=400; $l.Font=New-Object Drawing.Font("Segoe UI",9,[Drawing.FontStyle]::Bold); $form.Controls.Add($l) }

Add-Header "Server" $y; $y+=24
Add-Label "Server name (shown to players)" $y; $tName = Add-Box $cfg.ServerName $y; $y+=30
Add-Label "Max players (slots)" $y; $tMax = Add-Box $cfg.MaxPlayers $y; $y+=30
Add-Label "Server IP for players" $y; $tMaster = Add-Box $cfg.MasterHost $y; $y+=36

Add-Header "Database (MySQL / MariaDB)" $y; $y+=24
Add-Label "DB host" $y; $tDbHost = Add-Box $cfg.DbHost $y; $y+=30
Add-Label "DB port" $y; $tDbPort = Add-Box $cfg.DbPort $y; $y+=30
Add-Label "DB user" $y; $tDbUser = Add-Box $cfg.DbUser $y; $y+=30
Add-Label "DB password" $y; $tDbPass = Add-Box $cfg.DbPass $y; $y+=30
Add-Label "DB name" $y; $tDbName = Add-Box $cfg.DbName $y; $y+=40

function Read-Form {
  $mp = 100; [int]::TryParse($tMax.Text, [ref]$mp) | Out-Null
  $pp = 3306; [int]::TryParse($tDbPort.Text, [ref]$pp) | Out-Null
  [pscustomobject]@{
    ServerName=$tName.Text; MaxPlayers=$mp; MasterHost=$tMaster.Text
    DbHost=$tDbHost.Text; DbPort=$pp; DbUser=$tDbUser.Text; DbPass=$tDbPass.Text; DbName=$tDbName.Text
  }
}

# Full-width "Initialize Database" button (run once after entering DB settings).
$btnSeed = New-Object Windows.Forms.Button; $btnSeed.Text="Initialize Database (run once, first setup)"; $btnSeed.Left=14; $btnSeed.Top=$y; $btnSeed.Width=396
$btnSeed.BackColor=[Drawing.Color]::FromArgb(60,130,200); $btnSeed.ForeColor=[Drawing.Color]::White
$btnSeed.Add_Click({ Seed-Database (Read-Form) })
$form.Controls.Add($btnSeed)
$y += 36

$status = New-Object Windows.Forms.TextBox
$status.Multiline=$true; $status.ReadOnly=$true; $status.ScrollBars="Vertical"
$status.Left=14; $status.Top=($y+44); $status.Width=396; $status.Height=70
$form.Controls.Add($status)
function Log($m) { $status.AppendText(("[{0}] {1}`r`n" -f (Get-Date -Format "HH:mm:ss"), $m)) }

$btnSave = New-Object Windows.Forms.Button; $btnSave.Text="Save Config"; $btnSave.Left=14; $btnSave.Top=$y; $btnSave.Width=120
$btnSave.Add_Click({ Save-Config (Read-Form); Log "Config saved (ymls written)." })
$form.Controls.Add($btnSave)

$btnStart = New-Object Windows.Forms.Button; $btnStart.Text="Start Server"; $btnStart.Left=145; $btnStart.Top=$y; $btnStart.Width=120
$btnStart.BackColor=[Drawing.Color]::FromArgb(76,175,80); $btnStart.ForeColor=[Drawing.Color]::White
$btnStart.Add_Click({ Start-All (Read-Form) })
$form.Controls.Add($btnStart)

$btnStop = New-Object Windows.Forms.Button; $btnStop.Text="Stop Server"; $btnStop.Left=276; $btnStop.Top=$y; $btnStop.Width=120
$btnStop.BackColor=[Drawing.Color]::FromArgb(220,80,80); $btnStop.ForeColor=[Drawing.Color]::White
$btnStop.Add_Click({ Stop-All })
$form.Controls.Add($btnStop)

$form.Add_FormClosing({ Stop-All })
Log "Ready. Edit settings, Save, then Start."
[void]$form.ShowDialog()
