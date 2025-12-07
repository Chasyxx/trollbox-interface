export { };

import { deunicode } from "../../text";
import { blockedUsers } from "../../storage";
import { getUser } from "../../trollbox";

export const name = "unblock";
export const operatorOnly = true;

export function execute(args: string[]): string {
    if (args.length < 1) {
        return "Give me someone to block!";
    }
    const user = getUser(args.join(" "));
    if (user === null) {
        return "Couldn't find that user.";
    }
    if (!blockedUsers.has(user.home)) {
        return "That user wasn't blocked to begin with.";
    }
    blockedUsers.delete(user.home);
    return `${deunicode(user.name)} (${user.home}) has been unblocked.`;
}