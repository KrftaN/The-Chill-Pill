const Discord = require("discord.js");

const bot = new Discord.Client();

const { token } = require("../../jsonFiles/config.json");

bot.login(token);

module.exports = {
	name: "test",
	aliases: ["test", "t"],
	description: "testing!",
	cooldown: 0,
	args: false,
	execute(message, args, guild) {
		message.channel.send("This test worked!");
	},
};
