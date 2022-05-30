const mongo = require("../../mongo");
const profileSchema = require("../../../schemas/profileSchema");

module.exports.give = async (senderId, receiverID, number, receiverUsername) => {
	return await mongo().then(async (mongoose) => {
		try {
			let gp = 500;
			let bank = 0;
			let wikiPoints = 25;

			const check = await profileSchema.findOne({
				userId: receiverID,
			});

			if (!check) {
				await new profileSchema({
					userId: receiverID,
					userName: receiverUsername,
					gp,
					bank,
					wikiPoints,
				}).save();
			}

			await profileSchema.findOneAndUpdate(
				{
					userId: senderId,
				},
				{
					$inc: {
						gp: -number,
					},
				},
				{
					upsert: true,
					new: true,
				}
			);

			const bal2 = await profileSchema.findOneAndUpdate(
				{
					userId: receiverID,
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

			return bal2.gp;
		} finally {
			mongoose.connection.close();
		}
	});
};
