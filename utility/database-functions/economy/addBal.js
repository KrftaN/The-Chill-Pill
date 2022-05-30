const mongo = require("../../mongo");
const profileSchema = require("../../../schemas/profileSchema");

module.exports.addBal = async (userId, number, userName) => {
	return await mongo().then(async (mongoose) => {
		try {
			let gp = 500;
			let bank = 0;
			let wikiPoints = 20;

			const check = await profileSchema.findOne({
				userId,
			});

			if (!check) {
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
					wikiPoints,
				}).save();
			}

			const result = await profileSchema.findOneAndUpdate(
				{
					userId,
				},
				{
					$inc: {
						gp: number,
					},
				},
				{
					upsert: true,
					new: true,
				}
			);

			gp = result.gp;

			return gp;
		} finally {
			mongoose.connection.close();
		}
	});
};
