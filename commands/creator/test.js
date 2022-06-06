const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "test",
	aliases: ["t"],
	description: "testing!",
	creator: true,
	args: false,
	execute(message, args, bot) {
		const url = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
		const messageId = url.split("/")[6];

		message.reply(messageId);
	},
};
