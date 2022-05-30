const mongo = require("../../mongo");
const guildSchema = require("../../../schemas/guildSchema");

module.exports.setLeave = async (guildId, guildName, channelId, leaveMessage) => {
	return await mongo().then(async (mongoose) => {
		try {
			await guildSchema.findOneAndUpdate(
				{
					guildId,
				},
				{
					guildId,
					guildName,
					channelId,
					message: "Hope You Enjoy Your Stay!",
					leaveMessage,
				},
				{
					upsert: true,
				}
			);
		} finally {
			mongoose.connection.close();
		}
	});
};