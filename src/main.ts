import { commands } from "./commands";
import { cooldown } from "./cooldown";
import { deunicode } from "./text";
import { initInterface, eventEmitter, queueMessage, setName, setColor, currentName, 
    setPrefix, interfaceMessage, home, sid, room } from "./interface";
import { getAllUsers, getUser, UserStatus } from "./trollbox";

setName("test bot [!]");
setColor("yellow");
setPrefix("!");

eventEmitter.on("ready",()=>{
    queueMessage("Congratulations! The bot framework is working correctly.");
});

const shadowNames = [
    "test1 [!]",
    "testB [!]",
    "testIII [!]",
    "test4 [!]",
    "testE [!]"
];

let shadowspams = 0;

function handleShadowspam() {
    console.log("Shadowspamming detected, renaming");
    const name = shadowNames[shadowspams];
    if (!name) {
        const idx = shadowspams - shadowNames.length;
        const cursor = "|/-\\!"[idx % 5 | 0];
        const cursor2 = "|!\\-~/A"[idx / 2 % 7 | 0];
        const cursor3 = "|!/ZA-~=S\\Y"[idx / 3 % 11 | 0];
        setName(`${cursor}${cursor2}${cursor3}bot`);
    } else setName(name);
    if(Math.random()<0.1&&shadowspams>0) shadowspams--;
    else shadowspams++;
};

eventEmitter.on("updateUsers", function() {
    for(const user of getAllUsers()) {
        if(user.sid===sid) continue;
        if(user.name===currentName) {
            handleShadowspam();
            break;
        }
    }
});

eventEmitter.on("command", async function onCommand(commandArgs: string[], messageData: interfaceMessage) {
    const user = getUser(messageData.nick, messageData.home);
    if (user === null || user.sid === sid) return;
    const command = commands.get(deunicode(commandArgs[0]).toLowerCase().trim());
    if (command === undefined) return;

    const module = command.module;
    const power = user.status === UserStatus.operator;
    if (module.operatorOnly) {
        if (user.status === UserStatus.bot || user.status === UserStatus.blocked) return;
        if (user.status !== UserStatus.operator) {
            queueMessage(`Only ${getUser(home, undefined, true)?.name ?? "the operator"} may run this command.`);
            return;
        }
    } else {
        if (user.status === UserStatus.bot) {
            if (!module.allowForBots) return;
            if (!cooldown("unsafeCommand", 10)) return;
        }
        if (user.status === UserStatus.blocked) {
            if (!module.allowForBlockedUsers) return;
            if (!cooldown("unsafeCommand", 10)) return;
        }
    }
    if(module.denyInAtrium && room === "atrium" && !power) {
        if(cooldown("notinatrium",60)) queueMessage("You can't use this in atrium!\nUse %room to move the bot elsewhere in order to use this.");
        return;
    }
    const name = module.name??(module.names??[])[0];
    const output = await module.execute(commandArgs.slice(1), messageData, user);
    if (output) queueMessage(output);
});

initInterface();