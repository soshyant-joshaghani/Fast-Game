import { defineRoom } from "colyseus";

import { GameTestRoom } from "./game-test/index.js";

/**
 * All Colyseus rooms — add one import + entry per game folder.
 * app.config.ts loads this object as the server room registry.
 */
export const gameRooms = {
  game_test_room: defineRoom(GameTestRoom),
};
