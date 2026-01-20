First are Utilities:
 * `cooldown.ts`: Functions to create and handle simple cooldowns to prevent spam.
 * `trollbox.ts` - Getting Trollox users from homes, names, socket IDs etc.
    Interface events, living closer to actual Trollbox server output, have a more primitive user type with home and name only, so you can use getUser with the home and name to get more details.
 * `storage.ts`: Persistent JSON storage!
 * `text.ts`: Self explanatory

There's also these more important files:
 * Any typescript `.ts` file in `src/commands` will attempt to be read as a command.
 * `interface.ts`: Handles identity, the message queue, and the Socket.IO connection to the trollbox.
   This file also contains the actual loop and emits the events detailed below.
 * `commands.ts`: Loading commands.
 * `eval.ts`: Used by the eval command to actually run code.
 * `main.ts`: Actual bot coding using the interface events.

### Interface events

* `ready` - When the connection to trollbox actually exists
* `unready` - On any sort of disconnect
* `tick` - Every time the main loop fires and is about to send queued messages
* `updateUsers`: `(users: InterfaceUser[]) => void` - A list of interface users. Best used with `trollbox.ts` `getAllUsers()`.
* `userJoined`: `(joinedUser: interfaceUser) => void` - The new user. NOTE: `trollbox.ts` doesn't know about the user at this point.
* `userLeft`: `(joinedUser: interfaceUser) => void` - The user that left. NOTE: This is the LAST moment where `trollbox.ts` knows of the user.
* `userChangeNick`: `(oldIdentity: interfaceUser, newIdentity: interfaceUser) => void` - User's old and new identities. NOTE: This is the LAST moment where `trollbox.ts` uses the old identity.
* `message`: `(text: string, metadata: interfaceMessage) => void` - The message and associated user data. Best used with `trollbox.ts` `getUser(metadata.home, metadata.name)`.
* `command`: `(args: string[], messageData: interfaceMessage) => void` - The list of commands and associated user data. Best used with `trollbox.ts` `getUser(metadata.home, metadata.name)`.