const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "id",
	aliases: [],
	description: "With this command you can check ID's.",
	args: false,
	maxArgs: 1,
	cooldown: 1,
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const targetId = target.id;

		const { channel } = message;

		const embed = new MessageEmbed()
			.setTitle("ID's")
			.setDescription("If you tag someone else you'll get their ID instead of yours.")
			.setColor("#DC143C")
			.addFields(
				{
					name: `This Channel ID:`,
					value: `\`${channel.id}\``,
					inline: true,
				},
				{
					name: `This Channel's Name:`,
					value: `\`${channel.name}\``,
					inline: true,
				},
				{
					name: `${message.author.id === targetId ? "Your User ID" : `${target.username}'s ID`}`,
					value: `\`${targetId}\``,
					inline: true,
				}
			)
			.setTimestamp(new Date());

		message.channel.send({ embeds: [embed] });
	},
};
