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
        defult: 1
	},
	xp: {
		type: Number,
		defult: 0
	},
});

module.exports = mongoose.model("userGuildLevels", lvlSchema);
