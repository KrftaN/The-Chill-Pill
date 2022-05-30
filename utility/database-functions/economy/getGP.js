const mongo = require("../../mongo");
const gpCache = new Object();
const profileSchema = require("../../../schemas/profileSchema");

module.exports.getGP = async (userId, userName) => {
    return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOne({
				userId,
			});

			let gp = 500;
			let bank = 0;
			let wikiPoints = 20;

			if (result) {
				gp = result.gp;
				bank = result.bank;
			} else {
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
					wikiPoints,
				}).save();
			}

			(gpCache[userId] = gp), bank;

			return [gp, bank];
		} finally {
			mongoose.connection.close();
		}
	});
};