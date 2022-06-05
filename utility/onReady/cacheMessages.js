const {
	reactionRoleInformation,
} = require("../database-functions/reactionroles/reactionRoleInformation");
const { deleteReactionRole } = require("../database-functions/reactionroles/deleteReactionRole");

module.exports.cacheMessages = async (bot) => {
	const messageArray = await reactionRoleInformation();

	messageArray.forEach(async (message) => {
		try {
			await bot.guilds.cache
				.get(message.guild)
				.channels.cache.get(message.channel)
				.messages.fetch(message.id);
		} catch (err) {
			await deleteReactionRole(message.uniqueId);
			return;
		}

		await bot.channels.cache.get(message.channel).messages.fetch(message.id);
	});
	console.log("Messages Cached");
};
