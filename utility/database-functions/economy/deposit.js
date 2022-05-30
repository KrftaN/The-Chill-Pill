const mongo = require("../../mongo");
const profileSchema = require("../../../schemas/profileSchema");

module.exports.deposit = async (userId, number) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOneAndUpdate(
				{
					userId,
				},
				{
					$inc: {
						gp: -number,
						bank: number,
					},
				},
				{
					upsert: true,
					new: true,
				}
			);

			gp = result.gp;
			bank = result.bank;

			return [gp, bank];
		} finally {
			mongoose.connection.close();
		}
	});
};
