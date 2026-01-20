# Code files

First are utilities:
 * `cooldown.ts`: Functions to create and handle simple cooldowns to prevent spam.
 * `trollbox.ts` - Getting Trollox users from homes, names, socket IDs etc.
    Interface events, living closer to actual Trollbox server output, don't have the status field, and elsewhere you may only have a home and/or name, so you can use `getUser` with the home and/or name to get more details.
 * `storage.ts`: Persistent JSON storage!
 * `text.ts`: Self explanatory
 * `eval.ts`: Used by the eval command to actually run code.
 * `commands.ts`: Loading commands.

There's also these more important files:
 * Any typescript `.ts` file in `src/commands` will attempt to be loaded as a command. This WILL import the file with it's side effects, even if it's not a command.
 * `interface.ts`: Handles identity, the message queue, and the Socket.IO connection to the trollbox.
   This file also contains the actual loop and emits the events detailed below.
 * `main.ts`: Actual bot coding using the interface events.

# interface.ts
## Exports
* `queueMessage(msg: string)`:
  Sends a message to the Trollbox.

* `queueMessagePriority(msg: string)`
  Sends a message with the trollbox, adding it to the start of the queue instead of the end.

* `name: string`, `setName(name: string)`: (changes) The bot's name.
* `color: string`, `setColor(color: string)`: (changes) The bot's color.
* `room: string`, `setRoom(room: string)`: (changes) The room the bot is currently in.
* `eventEmitter`: an `EventEmitter` where all the events are actually emitted.

## Events

* `ready` - When the bot successfully connects to the Trollbox
* `unready` - On any sort of disconnect
* `tick` - Every time the main loop fires and is about to send queued messages
* `updateUsers`: `users: InterfaceUser[]` - A list of interface users. Best used with `trollbox.ts` `getAllUsers()`.
* `userJoined`: `joinedUser: interfaceUser` - The new user. **NOTE: `trollbox.ts` doesn't know about the user at this point.**
* `userLeft`: `leftUser: interfaceUser` - The user that left. **NOTE: This is the LAST moment where `trollbox.ts` knows of the user.**
* `userChangeNick`: `oldIdentity: interfaceUser, newIdentity: interfaceUser` - User's old and new identities. **NOTE: This is the LAST moment where `trollbox.ts` uses the old identity.**
* `message`: `text: string, metadata: interfaceMessage` - The message and associated user data. Best used with `trollbox.ts` `getUser(metadata.home, metadata.name)`.
* `command`: `args: string[], messageData: interfaceMessage` - The list of commands and associated user data. Best used with `trollbox.ts` `getUser(metadata.home, metadata.name)`.

# Utility functions
## cooldown.ts
The "key" is a unique identifier for the cooldown.
* `cooldown(key: string, seconds: number): boolean`:
  Tries to start the cooldown, true if it succeeds and false if there's still an ongoing cooldown.

* `isOnCooldown(key: string, seconds: number): boolean`:
  Returns if a cooldown is ongoing.

* `cooldownTime(key: string, seconds: number): number`:
  Gives the number of seconds left on the cooldown (0 if there isn't one ongoing).

## trollbox.ts
### Converting InterfaceUsers to Users
* `getStatus(u: interfaceUser | null): UserStatus`:
  Gets the "status" of a user:
  * `'nobody'` if null, or if the home is `trollbox`,
  * `'operator'` if the user has the same home as the bot (this means it's your pc running both, and therefore you),
  * `'blocked'` if the user is banned from the bot,
  * `'bot'` if the user's name has [brackets],
  * `'user'` otherwise (unbanned, non-operator, non-bot, just a normal user).

* `convertInerfaceUserToUser(u: interfaceUser): User`:
  Adds the status field to a user (also changes `nick` to `name`).

### Grabbing users from the list of connected users
* `function* getAllUsers()`:
  Gives you a generator (e.g. you can `for user of getAllUsers()`) of all connected users.

* `function getAllUsersSorted()`:
  Gives you an array (this is the only multi-user function that does NOT return a generator, though you can still `for...of`) of all connected users, sorted mainly by home and then by name.

* `getUser(identifier1: string, identifier2?: string, excludeSelf?: true)`:
  Each identifier can be
  * A socket ID (any user matching the ID will be instantly returned)
  * A home (the full home is matched with more priority than the "subhome" (first 8 letters of home))
  * A nickname (case-sensitive total matches are treated with more priority than case-insentitive substrings)

  You can either give just one, or give both, at which point, both being strictly matched will take the most priority (returning instantly), only one strictly matching and the other lax matching takes medium priority, and both lax takes low priority. If either doesn't match at all, the user is not considered.

* `function* getUsersLax(identifier: string)`:
  Gives a generator of all users that match the identifier.

* `function* getUsersStrict(identifier: string)`:
  Gives a generator of all users that strictly match the identifier (no name substrings or subhomes).

* `function* getUsersInRoom(room: string, includeBlocked = false)`:
  Gives a generator of all users in a room.

* `function getHandle(home: string, replacement?: string): string`:
  Gives the name associated with a home. If the home isn't connected, it will return replacement, or the user's subhome if there is none.

## storage.ts
* `class Storage<T>(path, default)`: A generic Storage object, stores a JSON serialisable object T and can save/load it to it's file. Along with the file path, it also needs a default object.

* `class SetStorage<T>(path)`: A special storage type wrapping a `Set`. It automatically saves when changes are made. It's default state is empty.

* `class MapStorage<K,V>(path)`: Similar but it wraps a `Map`.

> [!NOTE]
>
> If a storage file cannot be loaded, defaults (either the default passed to `Storage` or an empty set or map) are used, and may overwrite previous data- Back up anything important!

## text.ts
* `fit(str: string, len: number)`:
  Pads text on both sides to get it to a certain length, or truncates it with an ellipsis.

* `unhide(x: string)`:
  Reveals invisible Unicode characters by replaceing them with tags
  
* `splitMultis(str: string)`:
  Splits UTF-16 points above 0x00FF into two characters.

* `wrapChars(str: string)`:
  Wraps UTF-16 points into the printable ASCII range.

* `deunicode(str: string)`:
  Turns an entire string into printable ASCII characters using the 3 above functions.

## eval.ts
* `function evalulate(code: string, asFunc = false, priv = false): string`: Runs code and gives the output as JSON.
If `asFunc` is `true`, it's treated as a function rather than as an expression. If `priv` is `true`, output is only logged to possible

> [!WARNING]
>
> This function is only used by the **operator-only eval command,** does **NOT** add any sandboxing, and by design gives access to all other parts of the bot's code.
> This includes but is not limited to:
> * Setting names or sending messages without restriction
> * reading from or writing to storage objects (including ban/admin lists or configuration)
> * Setting extremely long cooldowns or clearing cooldowns
> * Making web requests and reading or writing arbitrary files, sending off or grabbing arbitrary code or data
>
> There are all things **YOU as the operator** should be able to mess with during runtime, which is why this function and the eval command exist, but this is **NOT** a function you should let anybody else have access to.

## commands.ts: The structure of commands in TI
`src/commands.ts` goes through every file in `src/commands/` and tries to load it as a command.

Here's how a command would be structured:

1. It all starts wuth the usual importing utilities:
   ```ts
   export {}
   import { getUser } from "../trollbox"
   // import ...
   ```

2. You need to give your command a name. There's two ways you can do this:
   * Single name:
     ```ts
     export const name = "command";
     ```
   * Multiple names:
     ```ts
     export const names = [ "command", "cmd", "alias" ];
     ```

3. The command's implementation:
   ```ts
   export function execute(args: string[], messageData: interfaceMessage, user: User): string | void {
        // ...
        return "output";
   }
   ```

   messageData is the `interfaceMessage` metadata of the message.
   user is a `trollbox.ts` `User` with status.
   The function can either return nothing (`void`) or it can return a `string`. If a string is returned it will be sent as a message.