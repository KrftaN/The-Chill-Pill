const { MessageEmbed } = require("discord.js");
const { getGP } = require("../../utility/database-functions/economy/getGP");
const { commafy } = require("../../utility/functions/commafy");

module.exports = {
	name: "balance",
	aliases: ["bal"],
	description: "checks the users balance",
	args: false,
	minArgs: 0,
	maxArgs: 1,
	cooldown: 0,
	async execute(message, args) {
		const target = message.mentions.users.first() || message.author;

		const userName = target.username;

		const balance = await getGP(target.id, userName);

		const embedBal = new MessageEmbed() // This checks your own balance
			.setColor("#DC143C")
			.setTitle(`${userName}'s Balance`)
			.addField("Wallet", `> ***${commafy(balance[0])}*** GP`)
			.addField("Bank", `> ***${commafy(balance[1])}*** GP`)
			.setTimestamp(new Date());

		message.reply({ embeds: [embedBal] });
	},
};
