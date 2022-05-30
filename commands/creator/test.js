const {MessageEmbed} = require("discord.js");
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
