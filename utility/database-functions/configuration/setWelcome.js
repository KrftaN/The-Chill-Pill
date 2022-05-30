const mongo = require("../../mongo");
const guildSchema = require("../../../schemas/guildSchema");

module.exports.setWelcome = async (guildId, guildName, channelId, message) => {
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
					message,
					leaveMessage: "Another One Bits The Dust!",
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
