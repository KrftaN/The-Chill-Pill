const mongo = require("../../mongo");
const scheduleSchema = require("../../../schemas/scheduleSchema");

module.exports.getEssentialInfo = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			return [
				result.timeIniated,
				result.timeFinish,
				result.originalSender,
				result.originalSenderUsername,
				result.embedOption,
			];
		} finally {
			mongoose.connection.close();
		}
	});
};
