const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "event",
	data: new SlashCommandBuilder()
		.setName("event")
		.setDescription("Makes the bot send a custom direct message to a designated user."),
	async execute(interaction, bot) {
		const { options } = interaction;
	},
};
