@echo off
setlocal EnableExtensions
cd /d "%~dp0.."
if not exist .env copy /Y .env.example .env >nul 2>&1

call __init__\setup-local.bat
if errorlevel 1 exit /b 1

echo [fast-game] Starting dev infrastructure (db, proxy, adminer)...
docker compose -f compose.dev.yml up -d db proxy adminer
if errorlevel 1 exit /b 1

echo [fast-game] Waiting for Postgres...
:wait_db
docker compose -f compose.dev.yml exec -T db pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
  timeout /t 2 /nobreak >nul
  goto wait_db
)

set "ROOT=%CD%"

echo [fast-game] Running migrations + seed (local prestart)...
cd /d "%ROOT%\backend"
call "%ROOT%\.venv\Scripts\activate.bat"
set "PYTHONPATH=%CD%"
python app\backend_pre_start.py
if errorlevel 1 exit /b 1
alembic -c alembic.ini upgrade head
if errorlevel 1 exit /b 1
python app\initial_data.py
if errorlevel 1 exit /b 1
cd /d "%ROOT%"

set "API_PROXY_TARGET=http://localhost:8000"
set "PORT=2567"

echo [fast-game] Starting backend, frontend, and Colyseus game server...
start "fast-game-backend" cmd /k "cd /d "%ROOT%\backend" && call "%ROOT%\.venv\Scripts\activate.bat" && set PYTHONPATH=%ROOT%\backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
start "fast-game-frontend" cmd /k "cd /d "%ROOT%" && set API_PROXY_TARGET=%API_PROXY_TARGET% && npm run dev -w frontend -- --host --port 5173 --open"
start "fast-game-colyseus" cmd /k "cd /d "%ROOT%" && set PORT=2567 && npm run start -w game"

echo.
echo Dev stack ready (hot reload on save):
echo   Dashboard:   http://dashboard.localhost
echo   API docs:    http://api.localhost/docs  (Swagger)
echo   Scalar:      http://api.localhost/sdoc
echo   Game server: ws://game.localhost  (or ws://localhost:2567)
echo   Monitor:     http://game.localhost/monitor
echo   Playground:  http://game.localhost/playground
echo   Colyseus demo: http://dashboard.localhost/demo/colyseus
echo   Adminer:     http://adminer.localhost
echo   Traefik:     http://localhost:8090
echo.
echo Direct: http://localhost:5173  http://localhost:8000/docs  ws://localhost:2567
echo Close the backend/frontend/game terminal windows to stop app processes.
echo Run: docker compose -f compose.dev.yml down
pause
endlocal
