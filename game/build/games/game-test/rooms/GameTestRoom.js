import { Room } from "@colyseus/core";
import { CommunicationModule } from "../../../modules/communication/CommunicationModule.js";
import { GameTestRoomState } from "../schema/GameTestRoomState.js";
export class GameTestRoom extends Room {
    constructor() {
        super(...arguments);
        this.maxClients = 8;
        this.state = new GameTestRoomState();
    }
    onCreate() {
        new CommunicationModule(this);
        this.onMessage("ping", (client) => {
            client.send("pong", { at: Date.now() });
        });
    }
    onJoin(_client) {
        this.state.playerCount = this.clients.length;
    }
    onLeave(_client) {
        this.state.playerCount = this.clients.length;
    }
}
