const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const profileSchema = mongoose.Schema({
	userId: reqString,
	userName: reqString,
	coins: {
		type: Number,
		required: true,
	},
	bank: {
		type: Number,
		required: true,
	},
	level: {
		type: Number,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("userprofiles", profileSchema);
