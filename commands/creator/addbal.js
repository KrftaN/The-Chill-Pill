const { addBal } = require("../../utility/database-functions/economy/addBal");
const { getGP } = require("../../utility/database-functions/economy/getGP");
const { removeBal } = require("../../utility/database-functions/economy/removeBal");

module.exports = {
	name: "addbal",
	aliases: ["addbal"],
	description: "This add's balance to the mentioned user ",
	args: true,
	maxArgs: 1,
	minArgs: 1,
	cooldown: 1,
	creator: true,
	usage: "<amount you want to add>",
	async execute(message, args) {
		const mentionedUser = message.mentions.users.first();

		if (args[1]?.toLowerCase() === "clear") {
			removeBal(mentionedUser.id, await getGP(mentionedUser.id)[0]);

			return message.reply(`You have successfully cleared ${mentionedUser.username}'s balance.`);
		}

		const matches = args[1].match(/^[0-9]+$/);

		args[1] = Number(args[1]);

		if (!matches) return message.channel.send("You must only send a valid number.");

		await getGP(mentionedUser.id);

		await addBal(mentionedUser.id, args[1]);

		message.channel.send(
			`You have successfully added **${args[1]}** GP to **${mentionedUser.username}'s** balance`
		);
	},
};
