export { };

import { deunicode } from "../../text";
import { interfaceMessage } from "../../interface";
import { blockedUsers } from "../../storage";
import { getUser, User, UserStatus } from "../../trollbox";

export const name = "block";
export const operatorOnly = true;

export function execute(args: string[], _md: interfaceMessage, commandUser: User): string {
    if (args.length < 1) {
        return "Give me someone to block!";
    }
    const user = getUser(args[0]);
    if (user === null) {
        return "Couldn't find that user.";
    }
    if (blockedUsers.has(user.home) && args.length < 2) {
        return "That user is already blocked.";
    }
    if (user.home === commandUser.home) {
        return "You can't block yourself!";
    }
    if (user.status === UserStatus.operator) {
        return "You can't block the operator!";
    }
    blockedUsers.add(user.home);
    return `${deunicode(user.name)} (${user.home}) has been blocked.`;
}