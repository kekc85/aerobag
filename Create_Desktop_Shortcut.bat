@echo off
chcp 65001 > nul
title AeroBag Predictor - Desktop Shortcut Creator
color 0A
cls

echo ======================================================================
echo          [ AEROBAG PREDICTOR : DESKTOP SHORTCUT CREATOR ]
echo ======================================================================
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "create_shortcut.ps1"

echo.
echo ======================================================================
echo Ярлык "AeroBag Predictor" успешно создан на вашем Рабочем Столе!
echo ======================================================================
timeout /t 3 > nul
exit
