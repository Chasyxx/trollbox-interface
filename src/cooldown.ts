export {};

const cooldowns = new Map<string,[at: number, expires: number]>();

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