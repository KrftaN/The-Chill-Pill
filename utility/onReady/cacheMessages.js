const {
	reactionRoleInformation,
} = require("../database-functions/reactionroles/reactionRoleInformation");
const {
	deleteManyReactionRoles,
} = require("../database-functions/reactionroles/deleteManyReactionRoles");

module.exports.cacheMessages = async (bot) => {
	const messageArray = await reactionRoleInformation();
	let deletedMessagesIds = new Array();
	let botGuilds = new Array();

	await Promise.all(
		bot.guilds.cache.map(async (guild) => {
			botGuilds.push(guild.id);
		})
	);

	await Promise.all(
		messageArray.map(async (message) => {
			try {
				if (!botGuilds.includes(message.guild)) return;

				await bot.guilds.cache
					.get(message.guild)
					.channels.cache.get(message.channel)
					.messages.fetch(message.id);
			} catch (err) {
				deletedMessagesIds.push(message.uniqueId);
				return;
			}

			await bot.channels.cache.get(message.channel).messages.fetch(message.id);
		})
	);

	if (deletedMessagesIds.length !== 0) await deleteManyReactionRoles(deletedMessagesIds);

	console.log("-> Messages Cached");
};
