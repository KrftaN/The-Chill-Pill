const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "clearqueue",
	data: new SlashCommandBuilder().setName("clearqueue").setDescription("Clears the current queue."),
	async execute(interaction, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue) return interaction.reply(`There is no music currently playing! ❌`);

		if (!queue.tracks[0])
			return interaction.reply(`There is already no music in queue after the current one ❌`);

		await queue.clear().then(interaction.reply(`The queue has just been cleared. 🗑️`));
	},
};
