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
});

module.exports = mongoose.model("schedules", scheduleSchema);
