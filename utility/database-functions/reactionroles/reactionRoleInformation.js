const mongo = require("../../mongo");
const reactionRoleSchema = require("../../../schemas/reactionRoleSchema");

module.exports.reactionRoleInformation = async () => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await reactionRoleSchema.find();

			const idArray = new Array();

			result.forEach((data) => {
				idArray.push({
					id: data.messageId,
					channel: data.channelId,
					guild: data.guildId,
					uniqueId: data.reactionRoleId,
					emoticon: data.emoticon,
					role: data.roleId,
				});
			});

			return idArray;
		} finally {
			mongoose.connection.close();
		}
	});
};
