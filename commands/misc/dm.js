module.exports = {
	name: "dm",
	aliases: ["dm"],
	description: "Send a DM to another user",
	args: true,
	minArgs: 1,
	cooldown: 1,
	usage: "<message>",
	execute(message, args) {
		const msgSender = message.author.username;

		try {
			console.log(
				`[This DM was initated by: ${msgSender}] [The Message: ${message.content.slice(
					message.content.indexOf(">") + 1
				)}]`
			);

			let mentionedMember = message.mentions.users.first(); //get the user Object of the person who said it

			mentionedMember.send(message.content.slice(message.content.indexOf(">") + 1));

			message.channel.bulkDelete(1);
		} catch (err) {
			console.log(err);
		}
	},
};
