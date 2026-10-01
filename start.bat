@echo off
title Doraemon AI Companion & 4D Hub
color 0B
cls
echo ========================================================
echo   🐱🔔 DORAEMON AI DESKTOP COMPANION & 4D GADGET HUB
echo ========================================================
echo.
echo Starting 24/7 Home Wi-Fi LAN Server on port 4242...
echo.

start "" "http://localhost:4242"
node server/server.js
pause
