const mongo = require("./mongo");
const profileSchema = require("../schemas/profileSchema");
const scheduleSchema = require("../schemas/scheduleSchema");

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

module.exports.changeSchedule = async (messageId, userName, userId, reaction) => {
	return await mongo().then(async (mongoose) => {
		try {
			console.log("Running findOne()");

			const result = await scheduleSchema.findOne({
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

			//			if (reaction === "accept") {
			//				result.acceptedIds.push(userId);
			//				result.save();
			//			}

			console.log("RESULT1:", result);


			if (isArrEmpty() === true) {
				result[reaction].push(userName);
				result.save();
			} else if (!findField(userName)) {
				result[reaction].push(userName);
			} else if (currentPositionOfUserName != newPositionOfUserName) {

				result[findField(userName)].pop(userName);
				result[reaction].push(userName);
				result.save();
			} else {

				result[reaction].pop(userName);
				result.save();
			}

			return [accepted, denied, tentative];
		} catch {
			mongoose.connection.close();
		}
	});
};

module.exports.iniateSchedule = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			console.log("Running findOne()");

			const result = await scheduleSchema.findOne({
				messageId,
			});

			console.log("RESULT:", result);

			let accepted = [];
			let denied = [];
			let tentative = [];
			let acceptedIds = [];
			if (result) {
				accepted = result.accepted;
				denied = result.denied;
				tentative = result.tentative;
				acceptedIds = result.acceptedIds;
			} else {
				console.log("Inserting a document");
				await new scheduleSchema({
					messageId,
					accepted,
					denied,
					tentative,
					acceptedIds,
				}).save();
			}
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.testSchema = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			console.log("Running findOne()");

			const result = await scheduleSchema.findOne({
				authorId,
			});

			console.log("RESULT:", result);

			let accepted = [];
			let denied = [];
			let tentative = [];
			let acceptedIds = [];
			if (result) {
				accepted = result.accepted;
				denied = result.denied;
				tentative = result.tentative;
				acceptedIds = result.acceptedIds;
			} else {
				console.log("Inserting a document");
				await new scheduleSchema({
					messageId,
					accepted,
					denied,
					tentative,
					acceptedIds,
				}).save();
			}
		} finally {
			mongoose.connection.close();
		}
	});
};
