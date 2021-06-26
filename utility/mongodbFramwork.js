const mongo = require("./mongo");
const profileSchema = require("../schemas/profileSchema");
const scheduleSchema = require("../schemas/scheduleSchema");

module.exports = (bot) => {};

// Economy Database code starts here
module.exports.getGP = async (userId, userName) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOne({
				userId,
			});

			let gp = 100;
			let bank = 0;
			let level = 1;
			let size = Math.floor(Math.random() * 25) + 1;
			if (result) {
				gp = result.coins;
				bank = result.bank;
			} else {
				console.log("Inserting a document");
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
					level,
					size,
				}).save();
			}

			return [gp, bank];
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

module.exports.iniateSchedule = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			let accepted = [];
			let denied = [];
			let tentative = [];
			let acceptedIds = [];
			if (result) {
				accepted = result.accepted;
				tentative = result.tentative;
				denied = result.denied;

				acceptedIds = result.acceptedIds;
			} else {
				console.log("Inserting a document");
				await new scheduleSchema({
					messageId,
					accepted,
					tentative,
					denied,
					acceptedIds,
				}).save();
			}
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.deleteSchedule = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			console.log("Running findOneAndDelete()");

			await scheduleSchema.deleteOne({
				messageId,
			});
		} finally {
			mongoose.connection.close();
		}
	});
};
// Schedule Database code stops here
