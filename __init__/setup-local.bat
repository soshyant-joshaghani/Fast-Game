@echo off
setlocal
cd /d "%~dp0.."
if not exist .venv (
  echo Creating Python venv at .venv ...
  python -m venv .venv
)
call .venv\Scripts\activate.bat
python -m pip install -U pip
pip install -r requirements.txt
if not exist node_modules (
  echo Installing npm dependencies at root ...
  call npm install
)
if not exist frontend\node_modules mkdir frontend\node_modules
if not exist frontend\node_modules\@sveltejs (
  mklink /J frontend\node_modules\@sveltejs node_modules\@sveltejs >nul
)
if not exist frontend\node_modules\svelte (
  mklink /J frontend\node_modules\svelte node_modules\svelte >nul
)
call npm run prepare -w frontend 2>nul
echo Local environment ready.
endlocal
