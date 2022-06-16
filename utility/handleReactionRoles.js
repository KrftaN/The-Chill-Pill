const { MessageEmbed } = require("discord.js");

module.exports.handleReactionRoles = (roleId, guildId, user, bot) => {
	try {
		const role = bot.guilds.cache.get(guildId).roles.cache.find((role) => role.id === roleId);
		const member = bot.guilds.cache.get(guildId).members.cache.get(user.id);

		if (member.roles.cache.some((role) => role.id === roleId)) {
			const embed = new MessageEmbed()
				.setTitle("Reaction Removed!")
				.setColor("#800080")
				.setDescription(
					`<:minusbutcoolest:983670417522843698>Successfully removed \`${role.name}\``
				)
				.setTimestamp(new Date())
				.setFooter(
					"Use the help command for more useful commands.",
					bot.user.avatarURL({ dynamic: true })
				);

			member.send({ embeds: [embed] });

			member.roles.remove(role);
		} else {
			const embed = new MessageEmbed()
				.setTitle("Reaction Added!!")
				.setColor("#800080")
				.setDescription(`<:plus:983666900401807370>Successfully added \`${role.name}\``)
				.setTimestamp(new Date())
				.setFooter(
					"Use the help command for more useful commands.",
					bot.user.avatarURL({ dynamic: true })
				);

			member.send({ embeds: [embed] });
			member.roles.add(role);
		}
	} catch (err) {
		console.log(err);
	}
};
