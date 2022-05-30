const mongo = require("../../mongo");
const scheduleSchema = require("../../../schemas/scheduleSchema");

module.exports.getScheduleIds = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			acceptedIds = result.acceptedIds;

			return acceptedIds;
		} finally {
			mongoose.connection.close();
		}
	});
};
