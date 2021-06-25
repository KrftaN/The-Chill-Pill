const Discord = require("discord.js");

const bot = new Discord.Client();

module.exports = {
	name: "test",
	aliases: ["test", "t"],
	description: "testing!",
	cooldown: 0,
	args: false,
	execute(message, args, guild) {
		
		console.log(guild);
	},
};
