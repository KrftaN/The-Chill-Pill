const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "nowplaying",
	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Shows information about the current song."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply(`There is no music currently playing!. ❌`);

		const track = queue.current;

		const embed = new MessageEmbed();

		embed.setColor("RED");
		embed.setThumbnail(track.thumbnail);
		embed.setTitle(track.title);

		const methods = ["disabled", "track", "queue"];

		const timestamp = queue.getPlayerTimestamp();
		const trackDuration = timestamp.progress == "Forever" ? "Endless (Live)" : track.duration;

		embed.setDescription(
			`Audio **%${queue.volume}**\nDuration **${trackDuration}**\nLoop Mode **${
				methods[queue.repeatMode]
			}**\n${track.requestedBy}`
		);

		embed.setTimestamp();
		embed.setFooter("Shit bot", interaction.author.avatarURL({ dynamic: true }));

		const saveButton = new MessageButton();

		saveButton.setLabel("This button does fucking nothing");
		saveButton.setCustomId("saveTrack");
		saveButton.setStyle("SUCCESS");

		const row = new MessageActionRow().addComponents(saveButton);

		await interaction.reply({ embeds: [embed], components: [row] });
	},
};
