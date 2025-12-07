export { };

import { interfaceMessage, home, prefix } from "../../interface";
import { getAllUsersSorted, getUser, User } from "../../trollbox";
import { deunicode } from "../../text";
import { cooldown } from "../../cooldown";
import { fit } from "../../text";

export const name = "whotable";
export const allowForBlockedUsers = true;

const labels = { 
    operator: "Optr",
    admin: "Admn",
    blocked: "Blkd", 
    bot: "Bots", 
    user: " ·· ",
    nobody: "Noby"
}

export function execute(args: string[], _messageData: interfaceMessage, userData: User): string {
    const force = args.includes('--force') || args.includes('-F');
    if (force && userData.status !== "operator") {
        return `Only ${getUser(home,undefined,true)?.name??"the WDICI operator"} may use --force.`;
    }
    if (!cooldown("whotable",60)&&!force) {
        return `${prefix}whotable is still on cooldown`;
    }
    let table = `Online Users
╔════════╦═══════════════════════════════════╦════╦═══════════════╗
╟─ Home ─╫─────── Deunicoded nickname ───────╫Type╫──── Color ────╢
`;  let lastHome = "";
    for (const user of getAllUsersSorted()) {
        if (lastHome !== user.home) table += "╠════════╬═══════════════════════════════════╬════╬═══════════════╣\n";
        lastHome = user.home;
        table += `║${user.home.slice(8, 16)}║ ${fit(deunicode(user.name), 33)} ` +
            `║${labels[user.status]}║` +
            `${fit(user.color, 15)}║\n`;
    }
    table += `╠════════╬═══════════════════════════════════╬════╬═══════════════╣
╟─ Home ─╫─────── Deunicoded nickname ───────╫Type╫──── Color ────╢
╚════════╩═══════════════════════════════════╩════╩═══════════════╝`;
    return table;
}
