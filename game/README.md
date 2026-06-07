# fast-game Colyseus server

Single-node Colyseus 0.17 template (no Redis, no multi-region). Port **2567**.

## Layout

```
game/src/
├── app.config.ts          register rooms here
├── games/game-test/       sample game (copy to add more)
└── modules/communication/ shared chat module
```

## Dev

```bash
npm run start -w game
```

| URL | Purpose |
|-----|---------|
| `ws://localhost:2567` | Direct WebSocket |
| `ws://game.localhost` | Via Traefik |
| `http://game.localhost/monitor` | Colyseus monitor |
| `http://game.localhost/playground` | Dev playground |

## Sample room

- **`game_test_room`** — minimal room with chat + ping/pong

## Tests

```bash
npm run test -w game
```

Tests live in `tests/game/` (not inside the `game/` package).

## Add a game

1. Copy `src/games/game-test/` → `src/games/your-game/`
2. Register the room in `src/games/index.ts` (import + `defineRoom` entry)
3. Add tests under `tests/game/`
