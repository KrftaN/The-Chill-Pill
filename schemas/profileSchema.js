const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const profileSchema = mongoose.Schema(
	{
		userId: reqString,
		userName: reqString,
		gp: {
			type: Number,
			required: true,
		},
		bank: {
			type: Number,
			required: true,
		},
		wikiPoints: {
			type: Number,
			required: true,
		},
		daily: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("userprofiles", profileSchema);
