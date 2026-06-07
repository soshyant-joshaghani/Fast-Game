import assert from "assert";
import { ColyseusTestServer } from "@colyseus/testing";

import app from "../../game/src/app.config.js";
import { GameTestRoomState } from "../../game/src/games/game-test/schema/GameTestRoomState.js";

const TEST_PORT = 19001;

describe("game-test room", () => {
  let colyseus: ColyseusTestServer;

  before(async () => {
    await app.listen(TEST_PORT);
    colyseus = new ColyseusTestServer(app);
  });

  after(async () => colyseus.shutdown());

  beforeEach(async () => colyseus.cleanup());

  it("connects and syncs state", async () => {
    const room = await colyseus.createRoom<GameTestRoomState>("game_test_room", {});
    const client = await colyseus.connectTo(room);

    assert.strictEqual(client.sessionId, room.clients[0].sessionId);

    await room.waitForNextPatch();

    assert.deepStrictEqual(
      { message: "Hello from game-test", playerCount: 1 },
      client.state.toJSON(),
    );
  });
});
