@echo off
setlocal
cd /d "%~dp0..\.."
echo [fast-game] Game server tests (mocha + @colyseus/testing)
call npm run test -w game
if errorlevel 1 exit /b 1
echo Game tests passed.
endlocal
