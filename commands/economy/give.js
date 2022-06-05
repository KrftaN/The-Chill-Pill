const { getGP } = require("../../utility/database-functions/economy/getGP");
const { give } = require("../../utility/database-functions/economy/give");

module.exports = {
	name: "give",
	aliases: [],
	description: "This is a description",
	args: true,
	minArgs: 1,
	maxArgs: 1,
	cooldown: 10,
	usage: "<amount you want to give>",
	async execute(message, args) {
		const mentionedUser = message.mentions.users.first();
		const validate = await getGP(message.author.id, message.author.username);

		const matches2 = args[1].match(/^[0-9]+$/);

		if (args[1] <= 0 || !matches2) return message.channel.send("You must send a valid **number**.");

		if (args[1] > validate[0]) return message.channel.send("haha cant do that ur too poor");

		const usersBal = await give(
			message.author.id,
			mentionedUser.id,
			args[1],
			mentionedUser.username
		);

		message.reply({
			content: `You have successfully given **${args[1]}** GP to **${mentionedUser.username}'s** balance. [Total Balance: ${usersBal}]`,
		});
	},
};
