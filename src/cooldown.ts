export {};

console.log("Module START - cooldown");

const cooldowns = new Map<string,[at: number, expires: number]>();

// Starts a cooldown if it isn't currently active and returns true.
// If the cooldown WAS active and it couldn't start it returns false.
export function cooldown(key: string, seconds: number): boolean {
    const dn = Date.now();
    if(!cooldowns.has(key)) {
        cooldowns.set(key,[dn,dn+seconds*1000]);
        return true;
    }
    const cooldown = cooldowns.get(key)!;
    if(dn<cooldown[1]) return false;
    if(dn<(cooldown[0]+seconds*1000)) return false;
    cooldowns.set(key,[dn,dn+seconds*1000]);
    return true;
}
export default cooldown;

export function isOnCooldown(key: string, seconds: number): boolean {
    const dn = Date.now();
    if(!cooldowns.has(key)) {
        return false;
    }
    const cooldown = cooldowns.get(key)!;
    if(dn<cooldown[1]) return true;
    if(dn<(cooldown[0]+seconds*1000)) return true;
    return false;
}

// Gives remaining time in milliseconds
export function cooldownTime(key: string, seconds: number): number {
    const dn = Date.now();
    if(!cooldowns.has(key)) {
        return 0;
    }
    const cooldown = cooldowns.get(key)!;
    if(dn<cooldown[1]) return cooldown[1]-dn;
    const c2 = (cooldown[0]+seconds*1000);
    if(dn<c2) return c2-dn;
    return 0;
}

console.log("Module END - cooldown");