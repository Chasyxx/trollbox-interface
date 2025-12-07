export { };

import { blockedUsers } from "../../storage";

export const name = "circuitunblock";
export const operatorOnly = true;

export function execute(args: string[]): string {
    if (args.length < 1) {
        return "Give me a home to unblock!";
    }
    if (!blockedUsers.has(args[0])) {
        return "That home wasn't blocked to begin with.";
    }
    blockedUsers.delete(args[0]);
    return `${args[0]} was directly removed from the blocklist.`
}