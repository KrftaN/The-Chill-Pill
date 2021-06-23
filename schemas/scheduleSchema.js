const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const scheduleSchema = mongoose.Schema({
	messageId: reqString,
	accepted: { type: Array },
	denied: { type: Array },
	tenetive: { type: Array },
	acceptedIds: { type: Array },
});

module.exports = mongoose.model("schedules", scheduleSchema);
