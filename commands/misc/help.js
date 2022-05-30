const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "help",
	aliases: [],
	description: "A list of all commands",
	args: false,
	cooldown: 1,
	async execute(message, args, bot) {
		message.delete();

		const { commands, slashCommands, commandAndFolders, slashCommandAndFolders } = bot;

		const embed = new MessageEmbed()
			.setColor("#DC143C")
			.setDescription(
				`This is an open source bot made by KraftaN#8103.\n\nhttps://github.com/KrftaN/The-Chill-Pill\n\n**Enabled commands** \`${
					commands.size + slashCommands.size
				}\``
			)
			.setAuthor(bot.user.username, bot.user.displayAvatarURL({ size: 1024, dynamic: true }))
			.setTimestamp(new Date())
			.setFooter("Bot made by KraftaN#8103", bot.user.avatarURL({ dynamic: true }));

		for (let i = 0; i < Object.keys(commandAndFolders).length; i++) {
			let fieldValues = new Array();

			Object.values(commandAndFolders)[i].forEach((commandName) => {
				fieldValues.push(
					commands.get(commandName).aliases.length !== 0
						? `\`${commands.get(commandName).name}(${commands
								.get(commandName)
								.aliases.join(", ")})\``
						: `\`${commands.get(commandName).name}\``
				);
			});

			embed.addField(Object.keys(commandAndFolders)[i].toString(), fieldValues.join(" | "));
		}

		embed.addField("\u200B", "\u200B");

		for (let i = 0; i < Object.keys(slashCommandAndFolders).length; i++) {
			let fieldValues = new Array();

			Object.values(slashCommandAndFolders)[i].forEach((commandName) => {
				fieldValues.push(`\`/${slashCommands.get(commandName).name}\``);
			});

			embed.addField(`/${Object.keys(slashCommandAndFolders)[i]}`, fieldValues.join(" | "));
		}

		await message.channel.send({ embeds: [embed] });
	},
};
