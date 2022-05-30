const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "resume",
	voiceChannel: true,
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the song."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply({content:`There is no music currently playing! ❌`});

		const success = queue.setPaused(false);

		await interaction.reply({
			content: success
				? `**${queue.current.title}**, The song continues to play. ✅`
				: `Something went wrong. ❌`,
		});
	},
};
