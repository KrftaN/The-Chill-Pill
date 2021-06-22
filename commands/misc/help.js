const { prefix } = require("../../jsonFiles/config.json");
const Discord = require("discord.js");

module.exports = {
	name: "help",
	description: "List all of my commands or info about a specific command.",
	aliases: ["commands"],
	args: false,
	cooldown: 5,
	execute(message, args) {
		if (message.channel.type !== "dm") {
			message.channel.bulkDelete(1);
		}

		const helpembed = new Discord.MessageEmbed()
			.setColor("#DC143C")
			.setTitle("Commands")
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
			)
			.addField("Admin", "kick, ban, clear")
			.addField("Misc", "dm, say, ping, roast, info, size")
			.addField("D&D", "roll, schedule")
			.addField("Economy", "bal, invest, give, daily, beg, coinflip, shop, inv, use, sell, buy")
			.addField("Prefix", `**\`${prefix}\`**`)
			.setTimestamp();

		message.author.send(helpembed);
	},
};
