const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const functions = require("../../utility/functions.js");

module.exports = {
	name: "test",
	aliases: ["t"],
	description: "testing!",
	creator: true,
	args: false,
	execute(message, args, guild, client) {
		console.log(
			message,
			bot.emojis.cache.find((emoji) => emoji.name === "flushed")
		);
	},
};
