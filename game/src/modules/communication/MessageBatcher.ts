export class MessageBatcher {
  private queue: any[] = [];

  constructor(private room: any) {
    setInterval(() => {
      if (this.queue.length === 0) return;

      this.room.broadcast("comm_batch", this.queue);

      this.queue = [];
    }, 100);
  }

  push(msg: any) {
    this.queue.push(msg);
  }
}
