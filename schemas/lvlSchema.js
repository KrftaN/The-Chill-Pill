const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const lvlSchema = mongoose.Schema({
	userId: reqString,
	guildId: reqString,
	userName: reqString,
	coins: {
		type: Number,
		required: true,
	},
	level: {
		type: Number,
		defult: 1,
		required: true,
	},
	xp: {
		type: Number,
		defult: 0,
		required: true,
	},
});

module.exports = mongoose.model("userGuildLevels", lvlSchema);
