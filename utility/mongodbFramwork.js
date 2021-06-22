const mongo = require("./mongo");
const profileSchema = require("../schemas/profileSchema");

module.exports = (bot) => {};

module.exports.getCoins = async (userId, userName) => {
	return await mongo().then(async (mongoose) => {
		try {
			console.log("Running findOne()");

			const result = await profileSchema.findOne({
				userId,
			});

			console.log("RESULT:", result);

			let coins = 100;
			let bank = 0;
			let level = 1;
			let size = Math.floor(Math.random() * 25) + 1;
			if (result) {
				coins = result.coins;
				bank = result.bank;
			} else {
				console.log("Inserting a document");
				await new profileSchema({
					userId,
					userName,
					coins,
					bank,
					level,
					size,
				}).save();
			}

			return [coins, bank];
		} finally {
			mongoose.connection.close();
		}
	});
};
