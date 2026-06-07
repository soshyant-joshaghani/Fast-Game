import { ChatPayload, CommType } from "../CommunicationTypes.js";
import { BaseMessage } from "../CommunicationTypes.js";

export function registerChat(room: any, ctx: any) {
  room.onMessage(CommType.CHAT, (client: any, data: ChatPayload) => {
    if (!ctx.rateChat.allow(client.sessionId)) return;
    if (!ctx.flood.check(client.sessionId)) return;

    const msg: BaseMessage & ChatPayload = {
      sender: client.sessionId,
      time: Date.now(),
      ...data,
    };

    ctx.history.push(msg);

    ctx.batch.push(msg);
  });
}
