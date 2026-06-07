import { CommType } from "../CommunicationTypes.js";
export function registerChat(room, ctx) {
    room.onMessage(CommType.CHAT, (client, data) => {
        if (!ctx.rateChat.allow(client.sessionId))
            return;
        if (!ctx.flood.check(client.sessionId))
            return;
        const msg = {
            sender: client.sessionId,
            time: Date.now(),
            ...data,
        };
        ctx.history.push(msg);
        ctx.batch.push(msg);
    });
}
