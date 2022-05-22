const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "stop",
	data: new SlashCommandBuilder().setName("stop").setDescription("Stops the current queue."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply(`There is no music currently playing! ❌`);

		queue.destroy();

		await interaction.reply(
			`The music playing on this server has been turned off, see you next time ✅`
		);
	},
};
