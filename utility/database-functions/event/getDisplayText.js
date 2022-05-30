const mongo = require("../../mongo");
const scheduleSchema = require("../../../schemas/scheduleSchema");
const displayTextCache = new Object();

module.exports.getDisplayText = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			(displayTextCache[messageId] = result.displayText1),
				result.displayText2,
				result.displayText3,
				result.displayText4;

			return [result.displayText1, result.displayText2, result.displayText3, result.displayText4];
		} finally {
			mongoose.connection.close();
		}
	});
};
