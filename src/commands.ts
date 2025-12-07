export { };

import { Dirent, readdirSync } from "node:fs";
import { interfaceMessage } from "./interface";
import { User } from "./trollbox";

export type Command = (args: string[], messageData: interfaceMessage, userData: User) => (string | Promise<string | void> | void);
export type CommandModule = {
    name: string,
    execute: Command,
    operatorOnly?: true,
    allowForBlockedUsers?: true,
    allowForBots?: true,
    path: string
};
export const commands: Map<string, { path: string, module: CommandModule }> = new Map();

let commandFiles: Set<string> = new Set();

function addFilesFromDir(path: string) {
    const files: Dirent<string>[] = readdirSync(path + "/", { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            addFilesFromDir(path + "/" + file.name);
        } else if (file.isFile() && file.name.endsWith(".js")) {
            commandFiles.add(path + "/" + file.name);
        } else if (file.isFile() && file.name.endsWith(".d.ts")) {
            // empty
        } else console.error("Unknown filetype", path + "/" + file.name);
    }
}

export async function loadCommand(path: string) {
    try {
        const url = new URL(path,"file://"+__dirname+"/").href;
        const module = await import(url);
        if (module === null || module === undefined) {
            console.error("[ERROR] Couldn't load command file", path, "Why TF did you give me nulldefined");
            return false;
        }
        if (typeof module.name !== "string") {
            console.warn("[WARNING] Couldn't load command file", path, "Command name isn't a string");
            return false;
        }
        if (typeof module.execute !== "function") {
            console.warn("[WARNING] Couldn't load command file", path, "Command executor isn't a function");
            return false;
        }
        if (commands.has(module.name)) {
            console.error("[ERROR] Couldn't load command file", path, `Command conflict (with command in ${commands.get(module.name)!.path})`);
            return false;
        }
        commands.set(module.name, { path, module: module as CommandModule });
        return true;
    } catch (error) {
        console.error("[ERROR] Couldn't load command file", path, error);
        return false;
    }
}


async function loadCommands() {
    for (const file of commandFiles) {
        await loadCommand(file);
    }
}

addFilesFromDir("./commands");

console.log(`Command files:\n${[...commandFiles.values()].join("\n")}`);

loadCommands().then(()=>{
    console.log(`Commands:\n${[...commands.keys()].join(", ")}`);
});