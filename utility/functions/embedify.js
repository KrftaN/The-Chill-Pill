const { MessageEmbed } = require("discord.js");

module.exports.embedify = (str) => {
	const embed = new MessageEmbed().setDescription(str).setColor("DC143C");

	return embed;
};
