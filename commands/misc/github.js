const Discord = require("discord.js");

module.exports = {
	name: "github",
	aliases: ["github", "repo", "gt"],
	description: "Link to my github repository",
	args: false,
	cooldown: 10,
	execute(message, args) {
		const githubEmbed = new Discord.MessageEmbed()
			.setTitle("Chill Pill Github Repository")
            .setColor("#DC143C")
            .setImage("https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png")
            .setTimestamp(new Date())
			.setDescription(
				"I've been working on this project for a little over a year, this was my first major coding project."
			)
			.setURL("https://github.com/KrftaN/The-Chill-Pill");

            message.channel.send(githubEmbed)
	},
};
