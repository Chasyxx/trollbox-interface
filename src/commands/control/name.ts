export { };

import { setName } from "../../interface";
import { cooldown } from "../../cooldown";

export const name = "name";

export function execute(args: string[]): string {
    let name = args.join(" ").slice(0,15);
    if(name.length<1||/h\s*t+\s*t+\s*p/i.test(name)||/b\s*i+\s*g/i.test(name)||
	/a\s*n+\s*d+\s*r+\s*o+\s*i+\s*d/i.test(name)||/a\s*e+\s*r+\s*e+\s*x+\s*e+\s*a/.test(name)) return "Nice try...";
    if (!cooldown("identswitch", 5)) {
        return "Still on cooldown";
    }
    setName(name);
    return `Name change to ${name}`;
}