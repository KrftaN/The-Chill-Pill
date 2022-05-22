const Discord = require("discord.js");

module.exports = {
	name: "rules",
	aliases: ["wikirules", "wrules"],
	description: "checks the users balance",
	args: false,
	minArgs: 0,
	maxArgs: 1,
	cooldown: 0,
	async execute(message, args, bot) {
		const embedBal = new Discord.MessageEmbed() // This checks your own balance
			.setColor("#DC143C")
			.setTitle(`Rules`)
			.setDescription(`List of rules:`)
			.setTimestamp(new Date())
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/628172806755975168/968931425317449758/unknown.png"
			);

		message.reply({ embeds: [embedBal] });
	},
};
