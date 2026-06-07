export class RateLimiter {
  private last = new Map<string, number>();

  constructor(private delay: number) {}

  allow(id: string) {
    const now = Date.now();
    const prev = this.last.get(id) || 0;

    if (now - prev < this.delay) return false;

    this.last.set(id, now);
    return true;
  }
}
