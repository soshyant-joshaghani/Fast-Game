import { Schema, type } from "@colyseus/schema";

export class GameTestRoomState extends Schema {
  @type("string") message: string = "Hello from game-test";
  @type("number") playerCount: number = 0;
}
