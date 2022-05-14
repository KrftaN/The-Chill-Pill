const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "ping",
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong! Losers!"),
	async execute(interaction) {
		await interaction.reply(`🏓 | Latency is: **${Date.now() - interaction.createdTimestamp}ms!**`);
	},
};
