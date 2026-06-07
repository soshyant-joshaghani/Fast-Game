export class FloodGuard {
  private counter = new Map<string, number>();
  private window = 3000;
  private limit = 10;

  check(id: string) {
    const now = Date.now();

    const data = this.counter.get(id) || 0;

    if (data > this.limit) return false;

    this.counter.set(id, data + 1);

    setTimeout(() => {
      this.counter.set(id, (this.counter.get(id) || 1) - 1);
    }, this.window);

    return true;
  }
}
