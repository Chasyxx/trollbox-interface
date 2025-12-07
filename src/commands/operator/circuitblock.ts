export { };

import { blockedUsers } from "../../storage";

export const name = "circuitblock";
export const operatorOnly = true;

export function execute(args: string[]): string {
    if (args.length < 1) {
        return "Give me a home to block!";
    }
    if (blockedUsers.has(args[0])) {
        return "That home is already blocked.";
    }
    blockedUsers.add(args[0]);
    return `${args[0]} was directly added to the blocklist.`
}