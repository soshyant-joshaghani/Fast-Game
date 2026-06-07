export class MessageBatcher {
    constructor(room) {
        this.room = room;
        this.queue = [];
        setInterval(() => {
            if (this.queue.length === 0)
                return;
            this.room.broadcast("comm_batch", this.queue);
            this.queue = [];
        }, 100);
    }
    push(msg) {
        this.queue.push(msg);
    }
}
