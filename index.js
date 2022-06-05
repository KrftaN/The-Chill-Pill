const Discord = ({ Client } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({
	intents: [intents, "GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
	partials: [["MESSAGE", "CHANNEL", "REACTION", "USER"]],
});
const { token } = require("./jsonFiles/config.json");
const { Player } = require("discord-player");
const fs = require("fs");
const { registerPlayerEvents } = require("./utility/onReady/musicEvents.js");
bot.login(token);

bot.cooldowns = new Discord.Collection();
bot.config = require("./utility/config");
bot.player = new Player(bot, bot.config.opt.discordPlayer);

const eventsFolder = fs.readdirSync("./events");

registerPlayerEvents(bot);

for (const files of eventsFolder) {
	const event = require(`./events/${files}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args, bot));
	} else {
		bot.on(event.name, (...args) => event.execute(...args, bot));
	}
}
