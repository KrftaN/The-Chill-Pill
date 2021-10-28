const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const functions = require("../../utility/functions.js");

module.exports = {
	name: "test",
	aliases: ["t"],
	description: "testing!",
	cooldown: 0,
	args: false,
	execute(message, args, guild, client) {
		console.log(client);
	},
};
