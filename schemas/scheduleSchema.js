const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
	messageId: {
		type: String,
		required: true,
	},
	accepted: [String],
	tentative: [String],
	denied: [String],
	acceptedIds: [String],
	displayText1: {
		type: String,
		required: false,
	},
	displayText2: {
		type: String,
		required: false,
	},
	displayText3: {
		type: String,
		required: false,
	},
	displayText4: {
		type: String,
		required: false,
	},
});

module.exports = mongoose.model("schedules", scheduleSchema);
