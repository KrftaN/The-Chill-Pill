module.exports = {
	name: "dm",
	aliases: [],
	description: "Send a DM to another user",
	args: true,
	minArgs: 1,
	cooldown: 1,
	usage: "<message>",
	execute(message, args, ) {
		const mentionedMember = message.mentions.users.first();

		const messageToSend = message.content.slice(message.content.indexOf(">") + 1);

		if (!mentionedMember) {
			setTimeout(() => message.delete(), 25 * 1000);
			return message
				.reply("You need to provide a valid user to send the DM to.")
				.then((message) => {
					setTimeout(() => message.delete(), 25 * 1000);
				});
		}

		if (!messageToSend) {
			setTimeout(() => message.delete(), 25 * 1000);
			return message.reply("You need to provide a valid message!").then((message) => {
				setTimeout(() => message.delete(), 25 * 1000);
			});
		}
		message.delete();

		console.log(
			`[This DM was initated by: ${message.author.tag}] [The Message: ${message.content.slice(
				message.content.indexOf(">") + 1
			)}] [Reciver: ${mentionedMember.tag}]`
		);

		mentionedMember.send(messageToSend);
	},
};
