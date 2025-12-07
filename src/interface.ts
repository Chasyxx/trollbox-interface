'use strict';

//@ts-ignore - this version of socket.io does not have type declarations
import SIO from "socket.io-client";
import { decode as hDecode } from "he"

import { EventEmitter } from "node:events";

export { }

export let isReady = false;
export let socket = null;

export let eventEmitter = new EventEmitter();

function ready() {
    isReady = true;
    eventEmitter.emit("ready");
}

function unready() {
    isReady = false;
    eventEmitter.emit("unready");
}

// const watermark = ";--me:0;" // replace me with your specified watermark. everything else is required
const watermark = "";

export let name = "beepboop";
export function setName(val: string) { name = val; }
export let color = "red";
export function setColor(val: string) { color = val; }
export let prefix = "!";
export function setPrefix(val: string) { prefix = val; }
export let currentName = name;
export let currentColor = color;
export let home = "";
export let sid = "";
export const style = "";
export const pass = "";
export let loopTime = 1500;
let lastMessage = "";
let identAttemps = 0;

let messageQueue: string[] = [];

export type interfaceUser = { sid: string, home: string, nick: string, color: string, style: "", room: string, isBot: boolean };
export type interfaceMessage = { date: Date, home: string, nick: string, color: string, style: "" };

function convertTrollboxUserToInterfaceUser(user: interfaceUser, userSID: string): interfaceUser {
    return {
        color: hDecode(user.color),
        home: user.home,
        nick: hDecode(user.nick),
        isBot: user.isBot,
        room: hDecode(user.room),
        sid: userSID,
        style: hDecode(user.style) as ""
    };
}

export let connectedUsers: interfaceUser[] = [];

export function getPublicErrorInfo(error: unknown): string {
    if (Object.prototype.hasOwnProperty.call(error, "stack")) {
        const e = error as Error;
        let output = "";
        if (e.name) output += e.name + "\n";
        if (e.message) output += e.message + "\n";
        // if(e.stack) output += e.stack+"\n";
        return output.trim();
    } else {
        try {
            //@ts-ignore - error will be caught
            if (e?.message) return String(e.message);
            //@ts-ignore - error will be caught
            else return String(e);
        } catch {
            try {
                //@ts-ignore - error will be caught
                return String(e);
            } catch {
                return "Error cannot be disclosed";
            }
        }
    }
}

export function queueMessage(msg: string) {
    console.log("Queuing message", msg);
    messageQueue.push(msg);
}

export function queueMessagePriority(msg: string) {
    console.log("Queuing message with priority", msg);
    messageQueue.push(msg);
}

function createSocket() {
    //@ts-ignore - this version of socket.io sucks for typescript
    if (socket && socket.connected) socket.disconnect();
    socket = new SIO("wss://www.windows93.net:8088",
        {
            forceNew: true,
            transportOptions: {
                polling: {
                    extraHeaders: {
                        "Accept": "*/*",
                        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
                        "Host": "www.windows93.net:8088",
                        "Origin": "https://www.windows93.net",
                        "Referer": "https://www.windows93.net/",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                        "Connection": "keep-alive",
                        "Content-type": "text/plain;charset=UTF-8",
                        "Sec-GPC": 1
                    }
                }
            }
        }
    );
}

function loop() {
    if (!isReady) {
        setTimeout(function () { loop() }, loopTime);
        return;
    };
    if ((currentColor !== (color + watermark) && currentColor !== color) || currentName !== name) {
        if (identAttemps < 2) {
            identAttemps++;
            console.log("+++ Changing identity");
            console.log("Currently", currentColor, currentName);
            console.log("Expected", (color + watermark), name);
            console.log("Or", color, name);
            console.log("---");
            setTimeout(function () { sendUserInfo() }, 1000);
            setTimeout(function () { loop() }, 2000);
            return;
        }
        identAttemps = 0;
        currentColor = color;
        currentName = name;
        console.log("Assuming identity has already changed");
    }
    try {
        eventEmitter.emit("tick");
        if (messageQueue.length > 0) {
            let output = messageQueue.join("\n---\n");
            messageQueue = [];
            if (output.length > 4096) {
                queueMessage(output.slice(4096));
                output = output.slice(0, 4096);
            }
            if(output) {
                if(output===lastMessage) output = "\u200d" + output + "\u200b";
                lastMessage = output;
                //@ts-ignore - this version of socket.io sucks for typescript
                socket.emit("message", output);
            }
        }
    } catch (e) {
        console.error('An error has occured!', e);
        queueMessagePriority(`An error has occured!\n\n${getPublicErrorInfo(e)}`);
    } finally {
        setTimeout(function () { loop() }, loopTime);
    }
}

let lastSendUserInfo = 0;
function sendUserInfo(): boolean {
    //@ts-ignore - this version of socket.io sucks for typescript
    if (!(socket?.connected)) {
        console.warn("Tried to send user info while disconnected");
        return false;
    }
    const dn = Date.now();
    if (dn < (lastSendUserInfo + 3000)) {
        console.warn("User info is being sent way too quick");
        return false;
    }
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.emit('user joined', name, color + watermark, style, pass);
    return true;
}

function prepareSocket() {
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on("update history", function onUpdateHistory() {
        console.warn("TODO: add history");
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on("update users", function onUpdateUsers(users) {
        connectedUsers = [];
        for (const userSID in users) {
            if (!users.hasOwnProperty(userSID)) continue;
            const user = users[userSID] as interfaceUser;
            //@ts-ignore - this version of socket.io sucks for typescript
            if (userSID === sid) {
                home = user.home;
                currentName = user.nick;
                currentColor = user.color;
                identAttemps = 0;
            }
            connectedUsers.push(convertTrollboxUserToInterfaceUser(user, userSID));
        }
        eventEmitter.emit("updateUsers", connectedUsers);
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on("user joined", function onUserJoined(user: interfaceUser) {
        if (!user.nick || typeof user.nick !== 'string') return;
        eventEmitter.emit("userJoined", convertTrollboxUserToInterfaceUser(user, ""));
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on("user left", function onUserLeft(user: interfaceUser) {
        if (!user.nick || typeof user.nick !== 'string') return;
        eventEmitter.emit("userLeft", convertTrollboxUserToInterfaceUser(user, ""));
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on("user change nick", function onUserChangeNick(oldUser: interfaceUser, newUser: interfaceUser) {
        if (!oldUser.nick || typeof oldUser.nick !== 'string') return;
        if (!newUser.nick || typeof newUser.nick !== 'string') return;
        if (oldUser.nick === newUser.nick) return;
        eventEmitter.emit("userChangeNick", convertTrollboxUserToInterfaceUser(oldUser, ""), convertTrollboxUserToInterfaceUser(newUser, ""));
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on("message", function onMessage(data) {
        if (!data || !data.nick || !data.home || typeof data.msg !== 'string') return;
        const messageData: interfaceMessage = {
            color: hDecode(data.color ?? "white"),
            date: new Date(data.date ?? 0),
            home: data.home,
            nick: hDecode(data.nick),
            style: hDecode(data.style) as ""
        };
        const message = hDecode(data.msg);
        eventEmitter.emit("message", message, messageData);
        if (message.startsWith(prefix)) {
            let readHeadIdx = prefix.length - 1; // Skip the prefix
            const commandArgs = [];
            let processor = "";
            let quoted = false;
            while (++readHeadIdx < message.length) {
                const readHead = message[readHeadIdx];
                if ((message[readHeadIdx - 1] ?? ' ') === ' ' && readHead === '"' && !quoted) {
                    quoted = true; continue;
                }
                if (readHead === '"' && (message[readHeadIdx + 1] ?? ' ') === ' ' && quoted) {
                    quoted = false; continue;
                }
                if (readHead === ' ' && !quoted) {
                    if (processor.length > 0) commandArgs.push(processor);
                    processor = "";
                    continue;
                }
                processor += readHead;
            }
            if (processor.length > 0) commandArgs.push(processor);
            if (commandArgs.length > 0) eventEmitter.emit("command", commandArgs, messageData);
        }
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on("cmd", function onCmd(...a) {
        console.warn("Suspicious: Server used cmd event", ...a);
    });
}

function connect() {
    //@ts-ignore - this version of socket.io sucks for typescript
    if (socket?.connected) return;
    createSocket();
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.once('_connected', function () {
        console.log("Succesfully connected, sending user info");
        //@ts-ignore - this version of socket.io sucks for typescript
        sid = socket.id;
        lastSendUserInfo = 0;
        currentName = name;
        currentColor = color;
        function attempt(): void {
            if (sendUserInfo()) ready();
            else {
                //@ts-ignore - this version of socket.io sucks for typescript
                if (!(socket?.connected)) connect();
                else setTimeout(function () { attempt() }, 2000);
            }
        }
        attempt();
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.on('reconnect', function () {
        console.warn("Socket reconnected, resending info");
        //@ts-ignore - this version of socket.io sucks for typescript
        sid = socket.id;
        unready();
        currentName = name;
        currentColor = color;
        function attempt(): void {
            if (sendUserInfo()) ready();
            else {
                //@ts-ignore - this version of socket.io sucks for typescript
                if (!(socket?.connected)) connect();
                else setTimeout(function () { attempt() }, 2000);
            }
        }
        setTimeout(function () { attempt() }, 2000);
    });
    //@ts-ignore - this version of socket.io sucks for typescript
    socket.once('disconnect', function () {
        console.log("Unexpected disconnect");
        socket = null; unready();
        setTimeout(function () { connect() }, 5000);
    });
    prepareSocket();
}

export function initInterface() {
    connect();
    loop();
}