@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18 or newer is required. Install it, then run this file again.
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Installing portfolio dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)
call npm run dev
pause
