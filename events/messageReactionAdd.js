const {
	reactionRoleInformation,
} = require("../utility/database-functions/reactionroles/reactionRoleInformation");
const { handleReactionRoles } = require("../utility/handleReactionRoles");
let data;

module.exports = {
	name: "messageReactionAdd",
	async execute(reaction, user, bot) {
		// When a reaction is received, check if the structure is partial
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				console.error("Something went wrong when fetching the message:", error);
				return;
			}
		}

		if (user.bot === true) return;

		data = data ?? (await reactionRoleInformation());

		const reactionRole = data.find(({ id }) => id === reaction.message.id);

		if (reactionRole.emoticon === reaction.emoji.name) {
			handleReactionRoles(reactionRole.role, reactionRole.guild, user, bot); //Adds/removes the role.
			reaction.users.remove(user);
		} else if (reactionRole.id === reaction.message.id && user.bot === false) {
			//Removes the reaction if it was made on one of the reaction role messages and not one of the chosen reactions.
			reaction.users.remove(user);
		}
	},
};
module.exports.changeCache = async (element) => {
	if (!data) {
		data = await reactionRoleInformation();
	}
	return data.push(element);
};
