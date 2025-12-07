export { };

import { interfaceMessage } from "../../interface";
import { getUser, User } from "../../trollbox";
import { deunicode } from "../../text";

export const name = "who";
export const allowForBlockedUsers = true;
export const allowForBots = true;

export function execute(args: string[], _messageData: interfaceMessage, userData: User): string {
    let identifier = userData?.home;
    if (args.length > 0) {
        identifier = args.join(" ");
    }
    const user = getUser(identifier);
    if (user === null) return "Couldn't find that user.";
    return `Home: ${user.home}

Top socket ID: ${user.sid} | Top nickname: @${user.name} (Deunicoded: ${deunicode(user.name)})
Color: ${user.color} | Current room: ${user.room} | Status: ${user.status}`
        + (args.length>0 ? "" : "\n\nTry adding a nickname to the command to see somebody else's info.")
}