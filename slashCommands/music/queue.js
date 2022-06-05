const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	voiceChannel: true,
	data: new SlashCommandBuilder().setName("queue").setDescription("Shows the current queue."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply({ content: `There is no music currently playing! ❌` });

		if (!queue.tracks[0])
			return interaction.reply({
				content: `There is no music in queue after the current song. ❌`,
			});

		const embed = new MessageEmbed();
		const methods = ["🔁", "🔂"];

		embed.setColor("RED");
		embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
		embed.setTitle(`Server Music List - ${interaction.guild.name} ${methods[queue.repeatMode]}`);

		const tracks = queue.tracks.map(
			(track, i) =>
				`**${i + 1}** - ${track.title} | ${track.author} (Started by <@${track.requestedBy.id}>)`
		);

		const songs = queue.tracks.length;
		const nextSongs =
			songs > 5
				? `And **${songs - 5}** Other Song...`
				: `There are **${songs}** Songs in the List.`;

		embed.setDescription(
			`Currently Playing: *${queue.current.title}*\n\n${tracks
				.slice(0, 5)
				.join("\n")}\n\n${nextSongs}`
		);

		embed.setTimestamp();
		embed.setFooter("Bot made by KraftaN#8103", interaction.user.avatarURL({ dynamic: true }));

		await interaction.reply({ embeds: [embed] });
	},
};
