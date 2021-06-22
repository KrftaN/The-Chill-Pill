module.exports = {
	name: "say",
	aliases: ["say"],
	description: "This is a description",
	args: true,
	minArgs: 1,
	cooldown: 3,
	usage: "<the message you want the bot to send>",
	execute(message, args) {
		message.channel.bulkDelete(1);

		message.channel.send(message.content.split(".say"));
	},
};
