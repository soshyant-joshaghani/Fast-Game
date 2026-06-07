export class FloodGuard {
    constructor() {
        this.counter = new Map();
        this.window = 3000;
        this.limit = 10;
    }
    check(id) {
        const now = Date.now();
        const data = this.counter.get(id) || 0;
        if (data > this.limit)
            return false;
        this.counter.set(id, data + 1);
        setTimeout(() => {
            this.counter.set(id, (this.counter.get(id) || 1) - 1);
        }, this.window);
        return true;
    }
}
