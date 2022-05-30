const mongo = require("../../mongo");
const scheduleSchema = require("../../../schemas/scheduleSchema");

module.exports.validateSchedule = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			let accepted = [];
			let denied = [];
			let tentative = [];

			if (result) {
				return;
			} else {
				await new scheduleSchema({
					messageId,
					accepted,
					tentative,
					denied,
				}).save();
			}
		} finally {
			mongoose.connection.close();
		}
	});
};
