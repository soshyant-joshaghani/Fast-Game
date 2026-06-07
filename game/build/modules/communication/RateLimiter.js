export class RateLimiter {
    constructor(delay) {
        this.delay = delay;
        this.last = new Map();
    }
    allow(id) {
        const now = Date.now();
        const prev = this.last.get(id) || 0;
        if (now - prev < this.delay)
            return false;
        this.last.set(id, now);
        return true;
    }
}
