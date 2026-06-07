export class MuteManager {
    constructor() {
        this.muted = new Map();
    }
    mute(player, target) {
        if (!this.muted.has(player)) {
            this.muted.set(player, new Set());
        }
        this.muted.get(player).add(target);
    }
    isMuted(player, sender) {
        const set = this.muted.get(player);
        if (!set)
            return false;
        return set.has(sender);
    }
}
