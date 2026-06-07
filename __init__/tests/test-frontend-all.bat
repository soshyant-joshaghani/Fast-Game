@echo off
setlocal
cd /d "%~dp0..\.."
call __init__\setup-local.bat
echo [fast-svelte] Frontend tests (vitest)
echo.
call npm test
if errorlevel 1 goto :fail
echo.
echo Frontend tests passed.
goto :done
:fail
echo.
echo Frontend tests failed.
pause
exit /b 1
:done
endlocal
