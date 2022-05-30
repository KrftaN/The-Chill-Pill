const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "skip",
	voiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skipes to the next song song in the queue."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing)
			return interaction.reply(`There is no music currently playing! ❌`);

		const success = queue.skip();

		await interaction.reply(
			success ? `**${queue.current.title}**, Skipped song ✅` : `Something went wrong ❌`
		);
	},
};
