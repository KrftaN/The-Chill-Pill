const Discord = require("discord.js");
const economy = require("../../utility/mongodbFramework");

module.exports = {
	name: "wikibalance",
	aliases: ["wikibal", "wbal"],
	description: "checks the users balance",
	args: false,
	minArgs: 0,
	maxArgs: 1,
	cooldown: 0,
	async execute(message, args, guild) {
		const target = message.mentions.users.first() || message.author;

		const userName = target.username;

		const balance = await economy.getWiki(target.id, userName);

		const embedBal = new Discord.MessageEmbed() // This checks your own balance
			.setColor("#DC143C")
			.setTitle(`${userName}'s WikiPoint Balance`)
			.setDescription(
				`You currently have **${balance} WikiPoints**. Compete with you friends to earn more!`
			)
			.setTimestamp(new Date())
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/628172806755975168/968931425317449758/unknown.png"
			);

		message.reply({ embeds: [embedBal] });
	},
};
