export { };

import { setName } from "../../interface";
import { cooldown } from "../../cooldown";

export const name = "name";

export function execute(args: string[]): string {
    let name = args.join(" ").slice(0,15);
    if(/ht+t+p/i.test(name)||/id+k/i.test(name)||/bi+g/i.test(name)||/an+d+r+o+i+d/i.test(name)) return "Nice try...";
    if (!cooldown("identswitch", 5)) {
        return "Still on cooldown";
    }
    setName(name);
    return `Name change to ${name}`;
}