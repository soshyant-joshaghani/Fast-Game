import { RateLimiter } from "./RateLimiter.js";
import { FloodGuard } from "./FloodGuard.js";
import { MessageBatcher } from "./MessageBatcher.js";
import { HistoryBuffer } from "./HistoryBuffer.js";
import { MuteManager } from "./MuteManager.js";
import { registerChat } from "./handlers/chat.js";
export class CommunicationModule {
    constructor(room) {
        this.room = room;
        this.ctx = {
            rateChat: new RateLimiter(800),
            flood: new FloodGuard(),
            batch: new MessageBatcher(room),
            history: new HistoryBuffer(50),
            mute: new MuteManager(),
        };
        registerChat(room, this.ctx);
        this.attachOnJoinHistorySender(room);
    }
    attachOnJoinHistorySender(room) {
        const originalOnJoin = typeof room.onJoin === "function" ? room.onJoin.bind(room) : null;
        if (!originalOnJoin)
            return;
        room.onJoin = (client, ...args) => {
            originalOnJoin(client, ...args);
            if (typeof client?.send === "function") {
                client.send("chat_history", this.ctx.history.getAll());
            }
        };
    }
}
