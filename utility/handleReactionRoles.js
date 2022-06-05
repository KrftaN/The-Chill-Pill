module.exports.handleReactionRoles = (roleId, guildId, user, bot) => {
	const role = bot.guilds.cache.get(guildId).roles.cache.find((role) => role.id === roleId);
	const member = bot.guilds.cache.get(guildId).members.cache.get(user.id);

	if (member.roles.cache.some((role) => role.id === roleId)) {
		member.roles.remove(role);
	} else {
		member.roles.add(role);
	}
};
