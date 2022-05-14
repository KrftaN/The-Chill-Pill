const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "reactionRoles",
	data: new SlashCommandBuilder()
		.setName("reactionroles")
		.setDescription("Let's people add roles via reacting to a targeted message."),
	async execute(interaction) {
		await interaction.reply(`🏓 | Latency is: **${Date.now() - interaction.createdTimestamp}ms.**`);
	},
};
