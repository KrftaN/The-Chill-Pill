const mongo = require("../../mongo");
const reactionRoleSchema = require("../../../schemas/reactionRoleSchema");

module.exports.getReactionRole = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await reactionRoleSchema.findOne({ messageId });

			return { uniqueId: result.reactionRoleId, emoticon: result.emoticon };
		} finally {
			mongoose.connection.close();
		}
	});
};
