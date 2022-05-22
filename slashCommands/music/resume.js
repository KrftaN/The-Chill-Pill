const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "resume",
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the song."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply(`There is no music currently playing! ❌`);

		const success = queue.setPaused(false);

		await interaction.reply(
			success
				? `**${queue.current.title}**, The song continues to play. ✅`
				: `Something went wrong. ❌`
		);
	},
};
