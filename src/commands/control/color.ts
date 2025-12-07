export { };

import { setColor } from "../../interface";
import { cooldown } from "../../cooldown";

export const name = "color";

export function execute(args: string[]): string {
    let color = args[0].slice(0,10);
    if (!cooldown("identswitch", 5)) {
        return "Still on cooldown";
    }
    if(!(/#?([1234567890abcdef]{3}|[1234567890abcdef]{4}|[1234567890abcdef]{6}|[1234567890abcdef]{8})/i.test(color))) {
        return "Only valid hex colors, please";
    }
    if(!color.startsWith("#")) color = "#"+color;
    setColor(color);
    return `Color change to ${color}`;
}