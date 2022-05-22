const Discord = require("discord.js");
const economy = require("../../utility/mongodbFramework");

module.exports = {
	name: "balance",
	aliases: ["bal"],
	description: "checks the users balance",
	args: false,
	minArgs: 0,
	maxArgs: 1,
	cooldown: 0,
	async execute(message, args, ) {
		const target = message.mentions.users.first() || message.author;

		const userName = target.username;

		const balance = await economy.getGP(target.id, userName);

		const embedBal = new Discord.MessageEmbed() // This checks your own balance
			.setColor("#DC143C")
			.setTitle(`${userName}'s Balance`)
			.addField("Wallet", `> ***${balance[0]}*** GP`)
			.addField("Bank", `> ***${balance[1]}*** GP`)
			.setTimestamp(new Date());

		message.reply({ embeds: [embedBal] });
	},
};
