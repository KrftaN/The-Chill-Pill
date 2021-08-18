const mongoose = require("mongoose");

const reqString = {
	type: String,
};

const guildschema = mongoose.Schema(
	{
		guildId: reqString,
		guildName: reqString,
		message: reqString,
		channelId: reqString,
		leaveMessage: reqString,
		levelChannelId: reqString,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("guildProfile", guildschema);
