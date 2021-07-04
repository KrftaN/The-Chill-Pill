const Discord = require("discord.js");
const economy = require("../../utility/mongodbFramework");

module.exports = {
	name: "deposit",
	aliases: ["dep", "depo", "deposit"],
	description: "This is a description",
	args: true,
	minArgs: 1,
	maxArgs: 1,
	cooldown: 1,
	usage: "<amount which you want to deposit>",
	async execute(message, args) {
		try {
			const validate = await economy.getGP(message.author.id, message.author.username);

			const matches1 = args[0].match(/^[0-9]+$/);

			if (args[0] > validate[0])
				return message.channel.send("You cannot deposit more than you have.");

			if (!matches1 && args[0] !== "all") return message.reply("You must deposit a number");

			args[0] = args[0] === "all" ? validate[0] : Number(args[0]);

			const balance = await economy.deposit(message.author.id, args[0]);

			const embedBal = new Discord.MessageEmbed()
				.setColor("#DC143C")
				.setTitle(`${message.author.username}'s Balance`)
				.addField("Wallet", `***${balance[0]}*** GP`)
				.addField("Bank", `***${balance[1]}*** GP`);

			message.channel.send(`You successfully deposited ${args[0]}. Total balance:`, embedBal);
		} catch (err) {
			message.channel.send("`<amount which you want to deposit>`");
			console.log(err);
		}
	},
};
