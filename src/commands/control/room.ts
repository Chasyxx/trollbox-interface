export { };

import { cooldown } from "../../cooldown";

export const name = "room";

export function execute(args: string[]): string {
    const room = args.join(" ").slice(0,10);
    if (!cooldown("roomswitch", 60)) {
        return "You're moving me around too fast!";
    }
    return "/room "+room;
}