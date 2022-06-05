const mongoose = require("mongoose");

const reqString = {
	type: String,
	required: true,
};

const reactionroleschema = mongoose.Schema(
	{
		messageId: reqString,
		emoticon: reqString,
		roleId: reqString,
		channelId: reqString,
		guildId: reqString,
		reactionRoleId: reqString,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("reactionRole", reactionroleschema);
