const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const spells = require("../../jsonFiles/spells.json");

module.exports = {
	name: "spelllist",
	data: new SlashCommandBuilder()
		.setName("spelllist")
		.setDescription("Sends an embed with all the available monsters"),
	async execute(interaction, bot) {},
};
