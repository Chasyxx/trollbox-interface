export {};

import { readFileSync } from "node:fs";
import { getPublicErrorInfo } from "../interface";

export const name = "info";

export const allowForBlockedUsers = true;

export function execute(args: string[]): string {
    const path = args[0]??"main"
    if(path.includes(".")) {
        return "Couldn't find that info page! (undefined)";
    }
    try{
        return readFileSync("../info/"+path+".txt", { encoding: "utf-8" }).trim();
    } catch(e) {
        // console.warn(e);
        return `Couldn't find that info page! (${getPublicErrorInfo(e)})`;
    }
}