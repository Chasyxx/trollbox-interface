# trollbox-interface
This is a template for creating bots for the WINDOWS93 trollbox.
It's based off of my Tayo/WDICI/IDKWTCI/Protropitous bot.
It's pretty similar to trollbox-bot, except I mostly made this from scratch and it's more refined than trb.

## Running the bot!
Scroll down for the Linux guide if you're using that.

### Windows
You first need to install [Node.JS](https://nodejs.org/en/download).
I'd also get [Git for Windows](https://git-scm.com/install/windows), and [Visual Studio Code](https://code.visualstudio.com/), as I used these to make the template.

If you have Git, then clone the repository. Else download the zip and extract it.

Either way you're expected to have a terminal at the main folder of the repo: "trollbox-interface".
(On win11, open a file explorer, open the trollbox-interface folder, then right click and open in terminal).

Now you run these below commands (note you might get hit with some execution policy error):
1. `npm install` - Installs dependencies for the bot, which are he and socket.io.
  Trollbox uses an ancient version of socket.io, so you might see it complain about vulnerabilities, but they can't be fixed until Janken updates the version of socket.io that trollbox uses.
2. `npm install -g typescript` - This way you can run the next command.
3. `tsc` - If all goes well this command won't say anything.
4. Enter the `target` folder (either using `cd target` or by opening a new terminal in that folder)
5. `node main.js` - You should see the bot connect!

### Troubleshooting
"Couldn't load storage file" - This is fine the first time around, defaults will be loaed. It's more of an issue if this isn't the first time you've started the bot since that means it got corrupted.

"No such file or directory" crash relating to storage files - the storage folder doesn't exist, make one.

"Module not found" - One reason is the terminal isn't in the target folder.

Seems to be stuck - I got this issue with Deno, switching to Node fixed it.

"Unexpected disconnect" - The trollbox doesn't like the name or color.

If you have any other problems go ahead and make an issue (or use Tayo's `%feedback` command), I'll add it here and/or fix the bug.

## Editing the template

I'd get Git and VSC, as I used these to make the template.
It also goes without saying that you'll have to learn typescript!

All the code is in `src`. See DOC.md for more.

## License

This is under the Expat license.
I'm not responsible for what you do with my interface, and I don't give you any warranties. See the license for the legal stuff.
