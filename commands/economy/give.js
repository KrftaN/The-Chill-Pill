const Discord = require("discord.js");
const economy = require("../../utility/mongodbFramework");

module.exports = {
	name: "give",
	aliases: ["give"],
	description: "This is a description",
	args: true,
	minArgs: 1,
	maxArgs: 1,
	cooldown: 3,
	usage: "<amount you want to give>",
	async execute(message, args) {
		const mentionedUser = message.mentions.users.first();
		const validate = await economy.getGP(message.author.id, message.author.username);

		try {
			const matches2 = args[1].match(/^[0-9]+$/);

			if (args[2] <= 0 || !matches2)
				return message.channel.send("You must send a valid **number**.");

			if (args[2] > validate[0]) return message.channel.send("haha cant do that ur too poor");

			economy.give(message.author.id, mentionedUser.id, args[1]);

			message.channel.send(
				`You have successfully given **${args[1]}** GP to **${mentionedUser.username}'s** balance`
			);
		} catch (err) {
			console.log(err);
			message.channel.send(".give `<@someone> <amount>`");
		}
	},
};