export { };

import { interfaceMessage, setRoom, room } from "../../interface";
import { cooldown } from "../../cooldown";

export const names = [ "room", "r" ];
export const allowWhenLimited = true;

export function execute(args: string[], _messageData: interfaceMessage): string | void {
    if(args.length<1) return `I'm in ${room}!`;
    const chosenRoom = args.join(" ").slice(0,20);
    if(chosenRoom.toLowerCase().includes("ownproperty")) return "NICE TRY!";
    if (!cooldown("roomswitch", 30)) {
        return "You're moving me around too fast!";
    }
    setRoom(chosenRoom);
}