const mongo = require("./mongo");
const profileSchema = require("../schemas/profileSchema");
const scheduleSchema = require("../schemas/scheduleSchema");
const gpCache = {};
const dailyCache = {};

module.exports = (bot) => {};

// Economy Database code starts here
module.exports.getGP = async (userId, userName) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOne({
				userId,
			});

			let gp = 500;
			let bank = 0;
			let size = Math.floor(Math.random() * 25) + 1;
			let haram = Math.floor(Math.random() * 100) + 1;
			if (result) {
				gp = result.gp;
				bank = result.bank;
			} else {
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
					size,
					haram,
				}).save();
			}

			(gpCache[`${userId}`] = gp), bank;

			return [gp, bank];
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.addBal = async (userId, number) => {
	return await mongo().then(async (mongoose) => {
		try {
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

module.exports.removeBal = async (userId, number) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOneAndUpdate(
				{
					userId,
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

			gp = result.gp;

			return gp;
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.withdraw = async (userId, number) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOneAndUpdate(
				{
					userId,
				},
				{
					$inc: {
						gp: number,
						bank: -number,
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

module.exports.give = async (senderId, receiverID, number) => {
	return await mongo().then(async (mongoose) => {
		try {
			const bal1 = await profileSchema.findOneAndUpdate(
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

module.exports.checkUserDate = async (userId, date) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOne({
				userId,
			});

			let gp = 500;
			let bank = 0;
			let size = Math.floor(Math.random() * 25) + 1;
			if (result) {
				gp = result.gp;
				bank = result.bank;
			} else {
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
					size,
				}).save();
			}

			userDate = result.daily;

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

				const bal = await module.exports.addBal(userId, 3000);

				return [true, bal];
			}
		} finally {
			mongoose.connection.close();
		}
	});
};

// Economy Database code stops here

// Schedule Database code starts here
module.exports.changeSchedule = async (messageId, userName, userId, reaction) => {
	return await mongo().then(async (mongoose) => {
		try {
			let result = await scheduleSchema.findOne({
				messageId,
			});

			accepted = result.accepted;
			denied = result.denied;
			tentative = result.tentative;
			acceptedIds = result.acceptedIds;

			const allFields = {
				accepted: accepted,
				denied: denied,
				tentative: tentative,
			};

			let currentPositionOfUserName;
			let newPositionOfUserName = reaction === "accepted" ? 0 : reaction === "denied" ? 1 : 2;

			function findField(userName) {
				for (let i = 0; i < 3; i++) {
					if (Object.values(allFields)[i].indexOf(userName) !== -1) {
						currentPositionOfUserName = i;
						return Object.keys(allFields)[i];
					}
				}
			}

			function isArrEmpty() {
				for (let i = 0; i < 3; i++) {
					if (Object.values(allFields)[i].length !== 0) {
						return false;
					}
				}
				return true;
			}

			async function addId(userId) {
				await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$push: {
							acceptedIds: userId,
						},
					}
				);
			}

			async function removeId(userId) {
				await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$pull: {
							acceptedIds: userId,
						},
					}
				);
			}

			if (isArrEmpty() === true) {
				await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$push: {
							[reaction]: userName,
						},
					}
				);

				if (newPositionOfUserName === 0) {
					addId(userId);
				}
			} else if (!findField(userName)) {
				//result[reaction].push(userName);

				await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$push: {
							[reaction]: userName,
						},
					}
				);
				if (newPositionOfUserName === 0) {
					addId(userId);
				}
			} else if (currentPositionOfUserName != newPositionOfUserName) {
				await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$push: {
							[reaction]: userName,
						},
						$pull: {
							[findField(userName)]: userName,
						},
					}
				);

				if (currentPositionOfUserName !== 0 && newPositionOfUserName === 0) {
					addId(userId);
				} else if (currentPositionOfUserName === 0 && newPositionOfUserName !== 0) {
					removeId(userId);
				}
			} else {
				if (currentPositionOfUserName === 0) {
					removeId(userId);
				}
				await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$pull: {
							[reaction]: userName,
						},
					}
				);
			}

			result = await scheduleSchema.findOne({
				messageId,
			});

			accepted = result.accepted;
			denied = result.denied;
			tentative = result.tentative;
			acceptedIds = result.acceptedIds;

			return [accepted, denied, tentative];
		} catch {
			mongoose.connection.close();
		}
	});
};

module.exports.getScheduleIds = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			acceptedIds = result.acceptedIds;

			return acceptedIds;
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.validateSchedule = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			let accepted = [];
			let denied = [];
			let tentative = [];

			if (result) {
				return;
			} else {
				await new scheduleSchema({
					messageId,
					accepted,
					tentative,
					denied,
				}).save();
			}
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.iniateSchedule = async (
	messageId,
	displayText1,
	displayText2,
	displayText3,
	displayText4
) => {
	return await mongo().then(async (mongoose) => {
		try {
			let accepted = [];
			let denied = [];
			let tentative = [];
			let acceptedIds = [];
			displayText4 = displayText4 || 0;

			if (displayText4.length > 0) {
				console.log("option 1 (2)", displayText4);

				await new scheduleSchema({
					messageId,
					accepted,
					tentative,
					denied,
					acceptedIds,
					displayText1,
					displayText2,
					displayText3,
					displayText4,
				}).save();
			} else {
				console.log("option 2 (2)");

				await new scheduleSchema({
					messageId,
					accepted,
					tentative,
					denied,
					acceptedIds,
					displayText1,
					displayText2,
					displayText3,
				}).save();
			}

			const result = await scheduleSchema.findOne({
				messageId,
			});
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.getDisplayText = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			return [result.displayText1, result.displayText2, result.displayText3, result.displayText4];
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.deleteSchedule = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			await scheduleSchema.deleteOne({
				messageId,
			});
		} finally {
			mongoose.connection.close();
		}
	});
};
// Schedule Database code stops here
