const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const testSchema = mongoose.Schema({
	messageId: reqString,
	accepted: { type: Array },
	denied: { type: Array },
	tenetive: { type: Array },
	acceptedIds: { type: Array },
});

module.exports = mongoose.model("test", testSchema);
