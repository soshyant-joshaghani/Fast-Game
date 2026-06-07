export class HistoryBuffer {
    constructor(max = 50) {
        this.max = max;
        this.buffer = [];
    }
    push(msg) {
        this.buffer.push(msg);
        if (this.buffer.length > this.max) {
            this.buffer.shift();
        }
    }
    getAll() {
        return this.buffer;
    }
}
