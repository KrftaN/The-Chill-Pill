const Discord = require("discord.js");

const bot = new Discord.Client();

module.exports = {
	name: "test",
	aliases: ["test", "t"],
	description: "testing!",
	cooldown: 0,
	args: false,
	execute(message, args) {
	message.channel.send("this is a test").then((message) => {
		const id = message.id;

		console.log(id)
	})
	},
};
