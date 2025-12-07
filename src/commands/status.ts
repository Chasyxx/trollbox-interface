import { commands } from "../commands";
import { getAllUsers, UserStatus } from "../trollbox";

export {}

export const name = "status";

export const allowWhenLimited = true;

export function execute(): string {
    const cpu = process.cpuUsage();
    let blockedUsers = 0;
    for(const i of getAllUsers()) {
        if(i.status === UserStatus.blocked) blockedUsers++
    }
    return `CPU usage: ${cpu.system/1000|0}ms system, ${cpu.user/1000|0}ms user
RAM usage: ${(process.memoryUsage().heapTotal/1024**2).toFixed(4)}MB
Loaded commands: ${[...commands.keys()].join(" ")}
Number of blocked users in server: ${blockedUsers}`;}