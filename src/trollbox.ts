export {};
import { interfaceUser, home, connectedUsers, sid } from "./interface";
import { deunicode } from "./text";

import { blockedUsers } from "./storage";

export enum UserStatus {
    /** The user does not exist. */
    nobody = "nobody",
    /** The user has the same home as the bot, granting it operator powers. */
    operator = "operator",
    /** The user was banned by an operator. */
    blocked = "blocked",
    /** The user is considered a bot by the trollbox server. */
    bot = "bot",
    /**
     * The user is present, is not an operator,
     * isn't blocked, and isn't considered a bot by the trollbox server.
     * 
     * In other words, it is an actual user. Hooray
     */
    user = "user"
}

export type User = { sid: string, home: string, name: string, color: string, style: "", room: string, status: UserStatus };

function getStatus(u: interfaceUser | null): UserStatus {
    if(u === null) return UserStatus.nobody;
    if(u.home===home) return UserStatus.operator;
    if(blockedUsers.has(u.home)) return UserStatus.blocked;
    if(u.isBot) return UserStatus.bot;
    return UserStatus.user;
}

export function convertInerfaceUserToUser(user: interfaceUser) {
    return {
        "color": user.color,
        "home": user.home,
        "name": user.nick,
        "room": user.room,
        "sid": user.sid,
        "status": getStatus(user),
        "style": user.style
    };
}

export function* getAllUsers(): Generator<User> {
    for(let user of connectedUsers) {
        yield convertInerfaceUserToUser(user);
    }
}

export function getAllUsersSorted() {
    const c = new Intl.Collator();
    let users = [...getAllUsers()];
    users.sort((a,b)=>c.compare(a.name,b.name));
    users.sort((a,b)=>c.compare(a.home,b.home));
    return users;
}

export function getUser(identifier1: string, identifier2?: string, excludeSelf?: true) {
    let lax: User | null = null;
    let strict: User | null = null;
    // let stricter: User | null = null;
    for(const user of getAllUsers()) {
        let match1lax = false;
        let match2lax = false;
        let match1strict = false;
        let match2strict = false;

        if(user.sid === sid && excludeSelf) continue;

        if(identifier1===user.sid||identifier2===user.sid) return user;
         

        if(identifier1===user.home) match1strict = true;
        if(identifier1===user.name) match1strict = true;
        if(deunicode(user.name).toLowerCase().includes(deunicode(identifier1).toLowerCase())) match1lax = true;

        if(identifier2===user.home) match2strict = true;
        if(identifier2===user.name) match2strict = true;
        if(identifier2 && deunicode(user.name).toLowerCase().includes(deunicode(identifier2).toLowerCase())) match2lax = true;


        if(identifier2) {
            if(match1strict&&match2strict) return user;
            if((match1strict&&match2lax)||(match2strict&&match1lax)) {
                strict = user;
            } else if(match1lax&&match2lax) {
                lax = user;
            }
        } else {
            if(match1strict) return user;
            if(match1lax) lax = user;
        }
    }
    return strict??lax;
}