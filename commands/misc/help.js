const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const fs = require("fs");

module.exports = {
	name: "help",
	aliases: [],
	description: "A list of all commands",
	args: false,
	cooldown: 1,
	execute(message, args, guild, bot, folders) {
		message.delete();

		const { commands } = bot;

		const folderLength = Object.keys(folders).length;

		const embed = new Discord.MessageEmbed()
			.setColor("#DC143C")
			.setDescription(
				`This is an open source bot made by KraftaN#8103.\n\nhttps://github.com/KrftaN/The-Chill-Pill\n\n**Enabled commands** \`${commands.size}\``
			)
			.setAuthor(bot.user.username, bot.user.displayAvatarURL({ size: 1024, dynamic: true }))
			.setTimestamp(new Date())
			.setFooter("Bot made by KraftaN#8103", bot.user.avatarURL({ dynamic: true }));

		for (let i = 0; i < folderLength; i++) {
			let fieldValues = new Array();

			Object.values(folders)[i].forEach((commandName) => {
				fieldValues.push(
					commands.get(commandName).aliases.length !== 0
						? `\`${commands.get(commandName).name}(${commands
								.get(commandName)
								.aliases.join(", ")})\``
						: `\`${commands.get(commandName).name}\``
				);
			});

			embed.addField(Object.keys(folders)[i].toString(), fieldValues.join(" | "));
		}

		message.channel.send({ embeds: [embed] });
	},
};
