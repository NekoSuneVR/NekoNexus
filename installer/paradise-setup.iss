; Paradise for UberStrike - one-click installer (Inno Setup).
; Produces a single ParadiseSetup.exe that auto-detects UberStrike from Steam and patches it
; to play on the Paradise free server. No .cmd, no PowerShell - pure native installer.
;
; Build:  iscc installer\paradise-setup.iss   (after misc\bundle-client.ps1 has produced the
;         self-contained toolkit in .release\client\_pak\free-server\).

#define AppName    "Paradise for UberStrike"
#define AppVer     "4.7.1"
#define Publisher  "NekoSuneVR"
#define ServerHost "paradisetest.nekosunevr.co.uk"
; payload produced by misc\bundle-client.ps1
#define Payload    "..\.release\client\_pak\free-server"

[Setup]
AppId={{8F3A1C42-9B7E-4D6A-B1E2-7C5D9A0F4E81}
AppName={#AppName}
AppVersion={#AppVer}
AppPublisher={#Publisher}
WizardStyle=modern
DisableDirPage=yes
DisableProgramGroupPage=yes
CreateAppDir=no
Uninstallable=no
PrivilegesRequired=admin
OutputDir=..\.release\installer
OutputBaseFilename=ParadiseSetup
Compression=lzma2/max
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64compatible
; ---- when you have a code-signing cert, uncomment to sign the produced exe ----
; SignTool=signtool
; SignedUninstaller=yes

[Messages]
WelcomeLabel2=This will patch your UberStrike to play on the Paradise free server (%n%n{#ServerHost}).%n%nPlease CLOSE UberStrike (and quit it in Steam) before continuing.

[Files]
; The whole self-contained toolkit is extracted to a temp folder during install.
Source: "{#Payload}\patcher\*";                          DestDir: "{tmp}\p\patcher"; Flags: recursesubdirs ignoreversion deleteafterinstall
Source: "{#Payload}\mod\*";                              DestDir: "{tmp}\p\mod";     Flags: ignoreversion deleteafterinstall
Source: "{#Payload}\Photon3Unity3D.dll";                 DestDir: "{tmp}\p";         Flags: ignoreversion deleteafterinstall
Source: "{#Payload}\Paradise.Patch.xml";                 DestDir: "{tmp}\p";         Flags: ignoreversion deleteafterinstall
Source: "{#Payload}\Paradise.Settings.Client.template.xml"; DestDir: "{tmp}\p";      Flags: ignoreversion deleteafterinstall

[Code]
var
  GamePage: TInputDirWizardPage;
  DetectedGame: string;

{ ---- locate UberStrike via Steam (registry -> libraryfolders.vdf -> fallbacks) ---- }
function NormSlashes(S: string): string;
begin
  StringChangeEx(S, '/', '\', True);
  Result := S;
end;

function HasGame(Folder: string): Boolean;
begin
  Result := (Folder <> '') and
    FileExists(AddBackslash(Folder) + 'UberStrike_Data\Managed\Assembly-CSharp.dll');
end;

procedure CollectVdfPaths(Vdf: string; Libs: TStringList);
var
  Content: AnsiString;
  Val: string;
  P, Q, R: Integer;
begin
  if not LoadStringFromFile(Vdf, Content) then Exit;
  P := 1;
  repeat
    Q := Pos('"path"', Content);
    if Q = 0 then Break;
    Content := Copy(Content, Q + 6, Length(Content));   { advance past this "path" }
    R := Pos('"', Content);                              { opening quote of value }
    if R = 0 then Break;
    Content := Copy(Content, R + 1, Length(Content));
    R := Pos('"', Content);                              { closing quote }
    if R = 0 then Break;
    Val := Copy(Content, 1, R - 1);
    StringChangeEx(Val, '\\', '\', True);
    Libs.Add(NormSlashes(Val));
    Content := Copy(Content, R + 1, Length(Content));
  until False;
end;

function FindUberStrike(): string;
var
  Steam, V: string;
  Libs: TStringList;
  I: Integer;
  G: string;
begin
  Result := '';
  Libs := TStringList.Create;
  try
    Steam := '';
    if RegQueryStringValue(HKCU, 'Software\Valve\Steam', 'SteamPath', V) then Steam := V;
    if (Steam = '') and RegQueryStringValue(HKLM, 'SOFTWARE\WOW6432Node\Valve\Steam', 'InstallPath', V) then Steam := V;
    if (Steam = '') and RegQueryStringValue(HKLM, 'SOFTWARE\Valve\Steam', 'InstallPath', V) then Steam := V;
    if Steam <> '' then
    begin
      Steam := NormSlashes(Steam);
      Libs.Add(Steam);
      CollectVdfPaths(AddBackslash(Steam) + 'steamapps\libraryfolders.vdf', Libs);
    end;
    Libs.Add(ExpandConstant('{commonpf32}\Steam'));
    Libs.Add(ExpandConstant('{commonpf}\Steam'));
    for I := 0 to Libs.Count - 1 do
    begin
      G := AddBackslash(Libs[I]) + 'steamapps\common\UberStrike';
      if HasGame(G) then
      begin
        Result := G;
        Exit;
      end;
    end;
  finally
    Libs.Free;
  end;
end;

procedure InitializeWizard();
begin
  DetectedGame := FindUberStrike();
  GamePage := CreateInputDirPage(wpWelcome,
    'UberStrike location',
    'Confirm where UberStrike is installed.',
    'Setup found your game below (or pick the folder that contains UberStrike_Data). Click Next to patch it.',
    False, '');
  GamePage.Add('UberStrike folder');
  if DetectedGame <> '' then
    GamePage.Values[0] := DetectedGame
  else
    GamePage.Values[0] := ExpandConstant('{commonpf32}\Steam\steamapps\common\UberStrike');
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if CurPageID = GamePage.ID then
  begin
    if not HasGame(GamePage.Values[0]) then
    begin
      MsgBox('That folder does not look like an UberStrike install' + #13#10 +
             '(missing UberStrike_Data\Managed\Assembly-CSharp.dll).' + #13#10 +
             'Pick your UberStrike folder and try again.', mbError, MB_OK);
      Result := False;
    end;
  end;
end;

{ ---- the patch itself ---- }
function CopyOrFail(Src, Dst: string): Boolean;
begin
  Result := FileCopy(Src, Dst, False);
end;

function DoPatch(): Boolean;
var
  Game, Managed, DataDir, Tmp, Mgd, PatchXml, Shim, BackupDll, GamePhoton, Tpl: string;
  TplA: AnsiString;
  RC: Integer;
  Mods: TArrayOfString;
  I: Integer;
begin
  Result := False;
  Game    := RemoveBackslashUnlessRoot(GamePage.Values[0]);
  Managed := AddBackslash(Game) + 'UberStrike_Data\Managed';
  DataDir := AddBackslash(Game) + 'UberStrike_Data';
  Tmp     := ExpandConstant('{tmp}\p');
  PatchXml := Tmp + '\Paradise.Patch.xml';
  Shim     := Tmp + '\Photon3Unity3D.dll';

  { 1) restore a clean Assembly-CSharp from backup (so re-running is safe) }
  BackupDll := AddBackslash(Managed) + 'backup\Assembly-CSharp.dll';
  if FileExists(BackupDll) then
    FileCopy(BackupDll, AddBackslash(Managed) + 'Assembly-CSharp.dll', False);

  { 2) patch Assembly-CSharp with UniversalUnityPatcher }
  if not Exec(Tmp + '\patcher\UniversalUnityPatcher.exe',
       '--backup --no-gui --silent --ignore-duplicate-patch -i "' + Managed + '" -p "' + PatchXml + '"',
       '', SW_HIDE, ewWaitUntilTerminated, RC) or (RC <> 0) then
  begin
    MsgBox('Patching failed.' + #13#10 +
           'Make sure UberStrike is fully CLOSED (and not running via Steam), then run this installer again.',
           mbError, MB_OK);
    Exit;
  end;

  { 3) install prebuilt mod DLLs }
  Mgd := AddBackslash(Managed);
  SetArrayLength(Mods, 5);
  Mods[0] := 'Paradise.Client.Bootstrap.dll';
  Mods[1] := 'Paradise.Client.dll';
  Mods[2] := '0Harmony.dll';
  Mods[3] := 'log4net.dll';
  Mods[4] := 'YamlDotNet.dll';
  for I := 0 to GetArrayLength(Mods) - 1 do
  begin
    if FileExists(Tmp + '\mod\' + Mods[I]) then
    begin
      if not CopyOrFail(Tmp + '\mod\' + Mods[I], Mgd + Mods[I]) then
      begin
        MsgBox('Could not copy ' + Mods[I] + ' (is UberStrike still running?).', mbError, MB_OK);
        Exit;
      end;
    end;
  end;

  { 4) replace the Photon transport with our free shim (back up the original once) }
  GamePhoton := Mgd + 'Photon3Unity3D.dll';
  if FileExists(GamePhoton) and not FileExists(GamePhoton + '.orig') then
    FileCopy(GamePhoton, GamePhoton + '.orig', False);
  if not CopyOrFail(Shim, GamePhoton) then
  begin
    MsgBox('Could not install the free transport (is UberStrike still running?).', mbError, MB_OK);
    Exit;
  end;

  { 5) write the settings file pointing at the Paradise server (HTTPS domain) }
  if LoadStringFromFile(Tmp + '\Paradise.Settings.Client.template.xml', TplA) then
  begin
    Tpl := TplA;
    StringChangeEx(Tpl, 'http://SERVER_HOST:8080/2.0/',    'https://{#ServerHost}/2.0/', True);
    StringChangeEx(Tpl, 'http://SERVER_HOST:8081/images/', 'https://{#ServerHost}/images/', True);
    StringChangeEx(Tpl, 'http://SERVER_HOST:8081/updates/','https://{#ServerHost}/updates/', True);
    SaveStringToFile(AddBackslash(DataDir) + 'Paradise.Settings.Client.xml', AnsiString(Tpl), False);
  end;

  Result := True;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    if DoPatch() then
      MsgBox('Done! UberStrike is patched for the Paradise server (' + '{#ServerHost}' + ').' + #13#10 +
             'Launch the game from Steam to play.', mbInformation, MB_OK);
  end;
end;
