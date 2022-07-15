const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const monsters = require("../../jsonFiles/monsters.json");

module.exports = {
	name: "monsterlist",
	data: new SlashCommandBuilder()
		.setName("monsterlist")
		.setDescription("Sends an embed with all the available monsters"),
	async execute(interaction, bot) {},
};
