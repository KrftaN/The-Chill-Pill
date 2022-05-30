const mongo = require("../../mongo");
const guildSchema = require("../../../schemas/guildSchema");

module.exports.setLevel = async (guildId, guildName, levelChannelId) => {
	return await mongo().then(async (mongoose) => {
		try {
			await guildSchema.findOneAndUpdate(
				{
					guildId,
				},
				{
					guildId,
					guildName,
					levelChannelId,
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
