const mongoose = require("mongoose");

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
