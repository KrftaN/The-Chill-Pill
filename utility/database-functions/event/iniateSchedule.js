const mongo = require("../../mongo");
const scheduleSchema = require("../../../schemas/scheduleSchema");

module.exports.iniateSchedule = async (
	messageId,
	dateNow,
	dateThen,
	originalSender,
	originalSenderUsername,
	embedOption,
	displayText1,
	displayText2,
	displayText3,
	displayText4
) => {
	return await mongo().then(async (mongoose) => {
		try {
			let accepted = [];
			let denied = [];
			let tentative = [];
			let acceptedIds = [];
			displayText4 = displayText4 || 0;

			if (displayText4.length > 0) {
				await new scheduleSchema({
					messageId,
					timeIniated: dateNow,
					timeFinish: dateThen,
					originalSender,
					originalSenderUsername,
					embedOption,
					accepted,
					tentative,
					denied,
					acceptedIds,
					displayText1,
					displayText2,
					displayText3,
					displayText4,
				}).save();
			} else {
				await new scheduleSchema({
					messageId,
					timeIniated: dateNow,
					timeFinish: dateThen,
					originalSender,
					originalSenderUsername,
					embedOption,
					accepted,
					tentative,
					denied,
					acceptedIds,
					displayText1,
					displayText2,
					displayText3,
				}).save();
			}

			await scheduleSchema.findOne({
				messageId,
			});
		} finally {
			mongoose.connection.close();
		}
	});
};

