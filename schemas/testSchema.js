const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const testschema = mongoose.Schema(
	{
		test: {
			type: Array,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("test", testschema);
