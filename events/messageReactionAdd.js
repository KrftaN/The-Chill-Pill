const {
	reactionRoleInformation,
} = require("../utility/database-functions/reactionroles/reactionRoleInformation");
const { handleReactionRoles } = require("../utility/handleReactionRoles");

module.exports = {
	name: "messageReactionAdd",
	async execute(reaction, user, bot) {
		// When a reaction is received, check if the structure is partial
		if (reaction.partial) {
			// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
			try {
				await reaction.fetch();
			} catch (error) {
				console.error("Something went wrong when fetching the message:", error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}

		if (user.bot === true) return;

		const data = await reactionRoleInformation();

		data.forEach((reactionRole) => {
			if (
				reactionRole.id === reaction.message.id &&
				reactionRole.emoticon === reaction.emoji.name
			) {
				reaction.users.remove(user);
				handleReactionRoles(reactionRole.role, reactionRole.guild, user, bot);
			} else if (reactionRole.id === reaction.message.id && user.bot === false) {
				reaction.users.remove(user);
			}
		});
	},
};
