const { prefix } = require("../../jsonFiles/config.json");

module.exports = {
	name: "say",
	aliases: [],
	description: "This is a description",
	args: true,
	minArgs: 1,
	cooldown: 3,
	usage: "<the message you want the bot to send>",
	execute(message, args, guild) {
		message.delete();

		message.channel.send(message.content.split(`${prefix}say`).pop());
	},
};
