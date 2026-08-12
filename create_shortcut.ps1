$WshShell = New-Object -ComObject WScript.Shell
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$Desktop = [Environment]::GetFolderPath('Desktop')

$TargetPath = Join-Path $ScriptDir "Start_AeroBag.bat"
$IconPath = Join-Path $ScriptDir "app_icon.ico"

# 1. Ярлык на Рабочем Столе
$DesktopShortcutPath = Join-Path $Desktop "AeroBag Predictor.lnk"
$Shortcut1 = $WshShell.CreateShortcut($DesktopShortcutPath)
$Shortcut1.TargetPath = $TargetPath
$Shortcut1.WorkingDirectory = $ScriptDir
$Shortcut1.IconLocation = "$IconPath,0"
$Shortcut1.Description = "AeroBag Predictor - Расчет Веса Багажа"
$Shortcut1.Save()

# 2. Ярлык в папке с программой
$FolderShortcutPath = Join-Path $ScriptDir "AeroBag Predictor.lnk"
$Shortcut2 = $WshShell.CreateShortcut($FolderShortcutPath)
$Shortcut2.TargetPath = $TargetPath
$Shortcut2.WorkingDirectory = $ScriptDir
$Shortcut2.IconLocation = "$IconPath,0"
$Shortcut2.Description = "AeroBag Predictor - Расчет Веса Багажа"
$Shortcut2.Save()

Write-Host "SUCCESS: Shortcuts created at $DesktopShortcutPath and $FolderShortcutPath"
