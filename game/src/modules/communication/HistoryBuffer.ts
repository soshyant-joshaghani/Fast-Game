export class HistoryBuffer<T> {
  private buffer: T[] = [];

  constructor(private max = 50) {}

  push(msg: T) {
    this.buffer.push(msg);

    if (this.buffer.length > this.max) {
      this.buffer.shift();
    }
  }

  getAll() {
    return this.buffer;
  }
}
