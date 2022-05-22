const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "pause",
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the song"),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply(`There is no music currently playing! ❌`);

		const success = queue.setPaused(true);

		await interaction.reply(
			success
				? `**${queue.current.title}**, The song continues to play. ✅`
				: `Something went wrong. ❌`
		);
	},
};
