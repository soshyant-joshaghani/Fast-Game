# Tests

- `backend/` — pytest against FastAPI
- `frontend/` — Vitest for pure TS helpers and config
- `game/` — Mocha + `@colyseus/testing` for Colyseus rooms

Run via `__init__/tests/*.bat` or:

```bat
npm test
.venv\Scripts\activate
cd backend
set PYTHONPATH=.;..\tests\backend
pytest ..\tests\backend\ -v
npm run test -w game
```

Backend tests in Docker need the dev stack running (`compose.dev.yml`).
