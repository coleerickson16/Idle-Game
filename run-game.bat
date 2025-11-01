@echo off
REM Simple script to run the Adventure Idle game on Windows

echo Starting Adventure Idle game server...
echo ========================================
echo.
echo The game will be available at:
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python -m http.server 8000
