const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "progress",
	data: new SlashCommandBuilder()
		.setName("progress")
		.setDescription("Shows how much is left on the song."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply(`There is no music currently playing! ❌`);

		const progress = queue.createProgressBar();
		const timestamp = queue.getPlayerTimestamp();

		if (timestamp.progress == "Infinity")
			return message.channel.send(`This song is live streaming, no duration data to display. 🎧`);

		await interaction.reply(`${progress} (**${timestamp.progress}**%)`);
	},
};
