const mongo = require("../../mongo");
const profileSchema = require("../../../schemas/profileSchema");

module.exports.wikiRacePointDistrubtion = async (winnerId, price, buyIn, losersId) => {
	return await mongo().then(async (mongoose) => {
		try {
			await profileSchema.findOneAndUpdate(
				{
					userId: winnerId,
				},
				{
					$inc: {
						wikiPoints: price - buyIn,
					},
				},
				{
					upsert: true,
					new: true,
				}
			);

			await Promise.all(
				losersId.map(async (userId) => {
					await profileSchema.findOneAndUpdate(
						{
							userId,
						},
						{
							$inc: {
								wikiPoints: -buyIn,
							},
						},
						{
							upsert: true,
							new: true,
						}
					);
				})
			);
		} finally {
			mongoose.connection.close();
		}
	});
};
