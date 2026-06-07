import { Room, Client } from "@colyseus/core";
import { CommunicationModule } from "../../../modules/communication/CommunicationModule.js";
import { GameTestRoomState } from "../schema/GameTestRoomState.js";

export class GameTestRoom extends Room<{ state: GameTestRoomState }> {
  maxClients = 8;
  state = new GameTestRoomState();

  onCreate() {
    new CommunicationModule(this);

    this.onMessage("ping", (client) => {
      client.send("pong", { at: Date.now() });
    });
  }

  onJoin(_client: Client) {
    this.state.playerCount = this.clients.length;
  }

  onLeave(_client: Client) {
    this.state.playerCount = this.clients.length;
  }
}
