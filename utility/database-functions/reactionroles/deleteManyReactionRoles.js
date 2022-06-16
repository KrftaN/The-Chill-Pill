const mongo = require("../../mongo");
const reactionRoleSchema = require("../../../schemas/reactionRoleSchema");

module.exports.deleteManyReactionRoles = async (reactionRoleIdArray) => {
	return await mongo().then(async (mongoose) => {
		try {
			await Promise.all(
				reactionRoleIdArray.map(async (reactionRoleId) => {
					await reactionRoleSchema.findOneAndDelete({ reactionRoleId });
				})
			);
		} finally {
			mongoose.connection.close();
		}
	});
};
