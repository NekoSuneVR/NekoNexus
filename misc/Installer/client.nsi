!include "MUI2.nsh"
!include "InstallOptions.nsh"

!define INSTNAME "NekoNexusClient"
!define VERSION "2.1.2"

Name "NekoNexus Client Runtime (Update ${VERSION})"
BrandingText "${U+A9} 2017, 2022-2024 Team FESTIVAL"
OutFile "..\..\.release\client\NekoNexus-client-win-x86.exe"
InstallDir "$PROGRAMFILES\Steam\steamapps\common\UberStrike\"
ShowInstDetails show
ShowUninstDetails show
Unicode true


; Installer Defines
!define MUI_ICON "..\..\assets\RunningIcon.ico"
!define MUI_UNICON "..\..\assets\RunningIcon.ico"
!define MUI_WELCOMEFINISHPAGE_BITMAP "banner.bmp"

!define MUI_ABORTWARNING_TEXT "Are you sure you want to quit the NekoNexus Setup?"
!define MUI_ABORTWARNING_CANCEL_DEFAULT
!define MUI_ABORTWARNING

!define MUI_WELCOMEPAGE_TITLE "Welcome to the NekoNexus Client Runtime Setup"
!define MUI_WELCOMEPAGE_TEXT "Setup will guide you through installing the NekoNexus Client Runtime (Update ${VERSION}) for UberStrike.$\r$\n$\r$\nPlease make sure the game is not running while installing NekoNexus.$\r$\n$\r$\nClick Next to continue."

!define MUI_LICENSEPAGE_RADIOBUTTONS
!define MUI_LICENSEPAGE_TEXT_TOP "Please read the following license agreement carefully:"
!define MUI_LICENSEPAGE_TEXT_BOTTOM "To install the NekoNexus Client Runtime, you must accept the agreement. Click Next to continue."

!define MUI_DIRECTORYPAGE_TEXT_TOP "Setup will install the NekoNexus Client Runtime in the following folder. To install in a different folder, click Browse and select another folder. Click Next to continue."
!define MUI_DIRECTORYPAGE_TEXT_DESTINATION "Path to UberStrike"

!define MUI_COMPONENTSPAGE_TEXT_TOP "Check the components you want to install and uncheck those you don't want to install.$\r$\nIf you have installed NekoNexus before, choose the $\"Upgrade$\" option. Click Install to start the installation."

!define MUI_FINISHPAGE_NOAUTOCLOSE
!define MUI_FINISHPAGE_TITLE "Completing the NekoNexus Client Runtime Setup"
!define MUI_FINISHPAGE_TEXT "The NekoNexus Client Runtime (Update ${VERSION}) has been installed on your computer.$\r$\n$\r$\nIf you need any help with running UberStrike and NekoNexus, feel free to join the official NekoNexus Discord server.$\r$\n$\r$\nClick Finish to close Setup."

!define MUI_FINISHPAGE_LINK "NekoNexus Discord"
!define MUI_FINISHPAGE_LINK_LOCATION "https://discord.gg/5PSspzWTCJ"
!define MUI_FINISHPAGE_LINK_COLOR "0088CC"

InstType "Full"
InstType "Upgrade"


; Installer Pages
!insertmacro MUI_PAGE_WELCOME

!define MUI_PAGE_HEADER_SUBTEXT "Please review the license terms before installing the NekoNexus Client Runtime."
!insertmacro MUI_PAGE_LICENSE "..\..\LICENSE"

!define MUI_PAGE_HEADER_TEXT "Choose UberStrike Location"
!define MUI_PAGE_HEADER_SUBTEXT "Choose the UberStrike installation folder in which to install the NekoNexus Client Runtime."
!insertmacro MUI_PAGE_DIRECTORY

!define MUI_PAGE_HEADER_SUBTEXT "Choose which features of the NekoNexus Client Runtime you want to install."
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE ComponentsLeave
!insertmacro MUI_PAGE_COMPONENTS

!insertmacro MUI_PAGE_INSTFILES

!insertmacro MUI_PAGE_FINISH


; Uninstaller Defines
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "banner.bmp"

!undef MUI_UNABORTWARNING_TEXT

!define MUI_UNABORTWARNING_TEXT "${MUI_ABORTWARNING_TEXT}"
!define MUI_UNABORTWARNING_CANCEL_DEFAULT
!define MUI_UNABORTWARNING

!define MUI_WELCOMEPAGE_TITLE "Welcome to the NekoNexus Client Runtime Uninstaller"
!define MUI_WELCOMEPAGE_TEXT "Setup will guide you through uninstalling the NekoNexus Client Runtime for UberStrike.$\r$\n$\r$\nBefore starting the uninstallation, make sure the game is not running."

!define MUI_PAGE_HEADER_TEXT "Uninstall NekoNexus"
!define MUI_PAGE_HEADER_SUBTEXT "Remove the NekoNexus Client Runtime from your computer."
!define MUI_UNCONFIRMPAGE_TEXT_TOP "The NekoNexus Client Runtime will be uninstalled from the following folder."

!define MUI_UNFINISHPAGE_NOAUTOCLOSE
!define MUI_FINISHPAGE_TITLE "Completing the NekoNexus Client Runtime Uninstall"
!define MUI_FINISHPAGE_TEXT "The NekoNexus Client Runtime has been uninstalled successfully from computer.$\r$\n$\r$\nIf you have installed the game via Steam, please make sure to verify the game files before installing NekoNexus or any other patch.$\r$\n$\r$\nClick Finish to close Setup."

!define MUI_FINISHPAGE_LINK "NekoNexus Discord"
!define MUI_FINISHPAGE_LINK_LOCATION "https://discord.gg/5PSspzWTCJ"
!define MUI_FINISHPAGE_LINK_COLOR "0088CC"

; Uninstaller Pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH


!insertmacro MUI_LANGUAGE "English"


; Sections
Section
	!insertmacro INSTALLOPTIONS_WRITE "ioSpecial.ini" "Settings" "CancelShow" "0"
SectionEnd

Section "NekoNexus Runtime" NekoNexusRuntime
	SectionIn RO

	SetOutPath "$INSTDIR"
	File "/oname=uberdaemon_nekonexus.exe" "..\..\.release\client\_pak\uberdaemon_nekonexus.exe"

	SetOutPath "$INSTDIR\UberStrike_Data"
	File /nonfatal /a /r "..\..\.release\client\_pak\UberStrike_Data\Managed"
	File /nonfatal /a /r "..\..\.release\client\_pak\UberStrike_Data\Maps"
	File /nonfatal /a /r "..\..\.release\client\_pak\UberStrike_Data\Plugins"

	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "DisplayName" "NekoNexus Client Runtime"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "DisplayIcon" '"$INSTDIR\NekoNexusUninstall.exe"'
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "DisplayVersion" "${VERSION}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "Publisher" "Team FESTIVAL"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "URLInfoAbout" "https://github.com/festivaldev/Paradise/"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "URLUpdateInfo" "https://github.com/festivaldev/Paradise/releases"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "HelpLink" "https://github.com/festivaldev/Paradise/wiki"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "UninstallString" '"$INSTDIR\NekoNexusUninstall.exe"'
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "NoModify" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}" "NoRepair" 1

	WriteUninstaller "$INSTDIR\NekoNexusUninstall.exe"
SectionEnd

Section "Patch UberStrike" UberStrikePatch
	SectionIn 1

	InitPluginsDir
	CreateDirectory "$PLUGINSDIR\patcher"
	SetOutPath "$PLUGINSDIR\patcher"
	File /r /x "*.zip" "..\..\packages\Patcher\bin\Release\*.*"
	File "..\..\.release\client\_pak\UberStrike_Data\NekoNexus.Patch.xml"

	DetailPrint "Patching UberStrike"
	ExecWait '$PLUGINSDIR\patcher\UniversalUnityPatcher.exe --backup --no-gui --silent --ignore-duplicate-patch -i "$INSTDIR\UberStrike_Data\Managed" -p "$PLUGINSDIR\patcher\NekoNexus.Patch.xml"'

	SetOutPath $INSTDIR
SectionEnd

Section "Uninstall"
	Delete "$INSTDIR\uberdaemon_nekonexus.exe"
	Delete "$INSTDIR\UberStrike_Data\NekoNexus.Settings.Client.xml"
	Delete "$INSTDIR\UberStrike_Data\steam_login"
	Delete "$INSTDIR\UberStrike_Data\Managed\0Harmony.dll"
	Delete "$INSTDIR\UberStrike_Data\Managed\log4net.dll"
	Delete "$INSTDIR\UberStrike_Data\Managed\NekoNexus.Client.Bootstrap.dll"
	Delete "$INSTDIR\UberStrike_Data\Managed\NekoNexus.Client.dll"
	Delete "$INSTDIR\UberStrike_Data\Managed\YamlDotNet.dll"
	Delete "$INSTDIR\UberStrike_Data\Maps\SpaceCity.unity3d"
	Delete "$INSTDIR\UberStrike_Data\Maps\SpacePortAlpha.unity3d"
	Delete "$INSTDIR\UberStrike_Data\Maps\UberZone.unity3d"
	Delete "$INSTDIR\UberStrike_Data\Plugins\NekoNexus.Client.DiscordRPC.exe"

	IfFileExists "$INSTDIR\UberStrike_Data\Managed\backup\Assembly-CSharp.dll" found not_found
		found:
			DetailPrint "Restoring original Assembly-CSharp.dll..."
			CopyFiles /SILENT "$INSTDIR\UberStrike_Data\Managed\backup\Assembly-CSharp.dll" "$INSTDIR\UberStrike_Data\Managed\Assembly-CSharp.dll"
			RMDir /r "$INSTDIR\UberStrike_Data\Managed\backup"

			goto end
		not_found:

		end:

	Delete "$INSTDIR\NekoNexusUninstall.exe"

	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${INSTNAME}"
SectionEnd

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
!insertmacro MUI_DESCRIPTION_TEXT ${NekoNexusRuntime} "Installs the NekoNexus Client Runtime and dependencies."
!insertmacro MUI_DESCRIPTION_TEXT ${UberStrikePatch} "Patches UberStrike to load NekoNexus at launch. Only required if installing for the first time."
!insertmacro MUI_FUNCTION_DESCRIPTION_END


; Functions
Function ComponentsLeave
	${If} ${SectionIsSelected} ${UberStrikePatch}
		MessageBox MB_YESNO "Are you sure you want to patch UberStrike?$\r$\nIf you have already patched UberStrike and patch it again, things will break really hard." IDYES true IDNO false
		true:
			goto end
		false:
			Abort
		end:

	${EndIf}
FunctionEnd
