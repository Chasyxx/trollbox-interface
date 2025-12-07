export {};

import { readFileSync } from "node:fs";
import { getPublicErrorInfo } from "../interface";

export const name = "help";

export const allowForBlockedUsers = true;

export function execute(args: string[]): string {
    const path = args[0]??"main"
    if(path.includes(".")) {
        return "Couldn't find that help page! (undefined)";
    }
    try{
        return readFileSync("../help/"+path+".txt", { encoding: "utf-8" }).trim();
    } catch(e) {
        return `Couldn't find that help page! (${getPublicErrorInfo(e)})`;
    }
}