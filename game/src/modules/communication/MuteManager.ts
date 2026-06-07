export class MuteManager {
  private muted = new Map<string, Set<string>>();

  mute(player: string, target: string) {
    if (!this.muted.has(player)) {
      this.muted.set(player, new Set());
    }

    this.muted.get(player)!.add(target);
  }

  isMuted(player: string, sender: string) {
    const set = this.muted.get(player);

    if (!set) return false;

    return set.has(sender);
  }
}
