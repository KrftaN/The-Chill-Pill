const mongo = require("../../mongo");
const profileSchema = require("../../../schemas/profileSchema");
const { addBal } = require("./addBal");

module.exports.checkUserDate = async (userId, date, userName) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOne({
				userId,
			});

			let gp = 500;
			let bank = 0;

			if (result) {
				gp = result.gp;
				bank = result.bank;
			} else {
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
				}).save();

				result.daily = "1944-06-06";
			}

			userDate = result.daily | undefined;

			if (userDate === date) {
				return false;
			} else {
				await profileSchema.findOneAndUpdate(
					{
						userId,
					},
					{
						daily: date,
					}
				);

				const bal = await addBal(userId, 3000);

				return [true, bal];
			}
		} finally {
			mongoose.connection.close();
		}
	});
};
