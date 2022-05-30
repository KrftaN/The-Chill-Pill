const mongo = require("../../mongo");
const wikiCache = new Object();
const profileSchema = require("../../../schemas/profileSchema");

module.exports.getWiki = async (userId, userName) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOne({
				userId,
			});
			let gp = 500;
			let bank = 0;
			let wikiPoints = 20;

			if (result) {
				wikiPoints = result.wikiPoints;
			} else {
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
					wikiPoints,
				}).save();
			}

			wikiCache[userId] = wikiPoints;

			return wikiPoints;
		} finally {
			mongoose.connection.close();
		}
	});
};
