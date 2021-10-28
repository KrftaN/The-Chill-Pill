const Discord = require("discord.js");
const economy = require("../../utility/mongodbFramework");

module.exports = {
	name: "beg",
	aliases: [],
	description: "You poor begger!!",
	args: false,
	maxArgs: 0,
	cooldown: 30,
	execute(message, args, guild) {
		economy.getGP(message.author.id);

		let outcome = Math.floor(Math.random() * 100) + 1;

		let randomnumber = Math.floor(Math.random() * 250);

		if (outcome >= 25) {
			economy.addBal(message.author.id, randomnumber);

			message.channel.send(`You begged and someone gave you ${randomnumber}GP`);
		} else {
			message.channel.send("You begged for many long hours but no one spared a single CP to you.");
		}
	},
};
