const { MessageEmbed } = require("discord.js");
const { getGP } = require("../../utility/database-functions/economy/getGP");
const { withdraw } = require("../../utility/database-functions/economy/withdraw");

module.exports = {
	name: "withdraw",
	aliases: ["wit", "with"],
	description: "This is a description",
	args: true,
	minArgs: 1,
	maxArgs: 1,
	cooldown: 1,
	usage: "<amount which you want to withdraw>",
	async execute(message, args) {
		try {
			const validate = await getGP(message.author.id, message.author.username);

			const matches1 = args[0].match(/^[0-9]+$/);

			if (args[0] > validate[1])
				return message.channel.send("You cannot withdraw more than you have in your bank.");

			if (!matches1 && args[0] !== "all") return message.reply("You must withdraw a number");

			args[0] = args[0] === "all" ? validate[1] : Number(args[0]);

			const balance = await withdraw(message.author.id, args[0]);

			const embedBal = new MessageEmbed()
				.setColor("#DC143C")
				.setDescription(`You successfully withdrew ${args[0]}.`)
				.setTitle(`${message.author.username}'s Balance`)
				.addField("Wallet", `***${balance[0]}*** GP`)
				.addField("Bank", `***${balance[1]}*** GP`);

			message.reply({ embeds: [embedBal] });
		} catch (err) {
			console.log(err);
		}
	},
};
