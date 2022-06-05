const mongo = require("../../mongo");
const reactionRoleSchema = require("../../../schemas/reactionRoleSchema");

module.exports.startReactionRoles = async (
	messageId,
	emoticon,
	roleId,
	channelId,
	guildId,
	reactionRoleId
) => {
	return await mongo().then(async (mongoose) => {
		try {
			await new reactionRoleSchema({
				messageId,
				emoticon,
				roleId,
				channelId,
				guildId,
				reactionRoleId,
			}).save();
		} finally {
			mongoose.connection.close();
		}
	});
};
