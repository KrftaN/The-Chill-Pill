const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "notifyNewTurn",
	alias: ["nnt"],
	data: new SlashCommandBuilder()
		.setName("notifynewturn")
		.setDescription("Ping a certain role when a new turn has begun"),
	async execute(interaction) {
		await interaction.reply(`🏓 | Latency is: **${Date.now() - interaction.createdTimestamp}ms.**`);
	},
};
