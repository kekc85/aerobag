@echo off
chcp 65001 > nul
title AeroBag Predictor - Flight Ops Control
color 0B
cls

echo ======================================================================
echo          [  AEROBAG PREDICTOR : BAGGAGE WEIGHT CALCULATOR  ]
echo                       FLIGHT OPS CONTROL SYSTEM
echo ======================================================================
echo.
echo  [SYSTEM INITIALIZATION]
echo  - Starting local HTTP web server on port 8080...
echo  - Launching browser at http://localhost:8080...
echo.

cd /d "%~dp0"

powershell -Command "Start-Process python -ArgumentList '-m http.server 8080' -WindowStyle Hidden"
timeout /t 1 > nul
start "" "http://localhost:8080"

echo  [STATUS] Application successfully online!
echo ======================================================================
timeout /t 2 > nul
exit
