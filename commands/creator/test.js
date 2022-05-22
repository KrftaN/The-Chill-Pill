const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const functions = require("../../utility/functions.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
	name: "test",
	aliases: ["t"],
	description: "testing!",
	creator: true,
	args: false,
	execute(message, args, bot) {
		console.log(bot);
	},
};
