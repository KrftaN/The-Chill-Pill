const mongo = require("../../mongo");
const reactionRoleSchema = require("../../../schemas/reactionRoleSchema");

module.exports.deleteReactionRole = async (reactionRoleId) => {
	return await mongo().then(async (mongoose) => {
		try {
			await reactionRoleSchema.findOneAndDelete({ reactionRoleId });
			console.log(1);
		} finally {
			mongoose.connection.close();
		}
	});
};
