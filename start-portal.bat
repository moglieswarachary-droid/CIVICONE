@echo off
TITLE CivicOne Premium Gold Citizen Portal Launcher
echo =================================================================
echo   CivicOne Digital Identity & Premium Gold Citizen Portal
echo =================================================================
echo.

SET NODE_EXEC="C:\Users\charv\node-v20.18.0-win-x64\node.exe"

echo 📦 Building production web bundle (Vite)...
%NODE_EXEC% "node_modules\vite\bin\vite.js" build

echo.
echo 🚀 Launching CivicOne Hosted Web Server on http://localhost:3001 ...
echo.

%NODE_EXEC% server/index.js
pause
