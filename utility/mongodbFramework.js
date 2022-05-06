const mongo = require("./mongo");
const profileSchema = require("../schemas/profileSchema");
const scheduleSchema = require("../schemas/scheduleSchema");
const guildSchema = require("../schemas/guildSchema");
const gpCache = new Object();
const wikiCache = new Object();
const displayTextCache = new Object();

// Economy Database code starts here
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

module.exports.getWiki = async (userId, userName) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await profileSchema.findOne({
				userId,
			});
			let gp = 500;
			let bank = 0;
			let wikiPoints = 20;

			if (result) {
				wikiPoints = result.wikiPoints;
			} else {
				await new profileSchema({
					userId,
					userName,
					gp,
					bank,
					wikiPoints,
				}).save();
			}

			wikiCache[userId] = wikiPoints;

			return wikiPoints;
		} finally {
			mongoose.connection.close();
		}
	});
};

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

module.exports.give = async (senderId, receiverID, number, senderUsername, receiverUsername) => {
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
				result = await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$push: {
							acceptedIds: userId,
						},
					},
					{
						upsert: true,
						new: true,
					}
				);
			}

			async function removeId(userId) {
				result = await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$pull: {
							acceptedIds: userId,
						},
					},
					{
						upsert: true,
						new: true,
					}
				);
			}

			if (isArrEmpty() === true) {
				result = await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$push: {
							[reaction]: userName,
						},
					},
					{
						upsert: true,
						new: true,
					}
				);

				if (newPositionOfUserName === 0) {
					addId(userId);
				}
			} else if (!findField(userName)) {
				//result[reaction].push(userName);

				result = await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$push: {
							[reaction]: userName,
						},
					},
					{
						upsert: true,
						new: true,
					}
				);
				if (newPositionOfUserName === 0) {
					addId(userId);
				}
			} else if (currentPositionOfUserName != newPositionOfUserName) {
				result = await scheduleSchema.findOneAndUpdate(
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
					},
					{
						upsert: true,
						new: true,
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
				result = await scheduleSchema.findOneAndUpdate(
					{
						messageId: messageId,
					},
					{
						$pull: {
							[reaction]: userName,
						},
					},
					{
						upsert: true,
						new: true,
					}
				);
			}

			return [result.accepted, result.tentative, result.denied];
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
	dateNow,
	dateThen,
	originalSender,
	originalSenderUsername,
	embedOption,
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
				await new scheduleSchema({
					messageId,
					timeIniated: dateNow,
					timeFinish: dateThen,
					originalSender,
					originalSenderUsername,
					embedOption,
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
				await new scheduleSchema({
					messageId,
					timeIniated: dateNow,
					timeFinish: dateThen,
					originalSender,
					originalSenderUsername,
					embedOption,
					accepted,
					tentative,
					denied,
					acceptedIds,
					displayText1,
					displayText2,
					displayText3,
				}).save();
			}

			await scheduleSchema.findOne({
				messageId,
			});
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.getEssentialInfo = async (messageId) => {
	return await mongo().then(async (mongoose) => {
		try {
			const result = await scheduleSchema.findOne({
				messageId,
			});

			return [
				result.timeIniated,
				result.timeFinish,
				result.originalSender,
				result.originalSenderUsername,
				result.embedOption,
			];
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

			(displayTextCache[messageId] = result.displayText1),
				result.displayText2,
				result.displayText3,
				result.displayText4;

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

module.exports.setWelcome = async (guildId, guildName, channelId, message) => {
	return await mongo().then(async (mongoose) => {
		try {
			await guildSchema.findOneAndUpdate(
				{
					guildId,
				},
				{
					guildId,
					guildName,
					channelId,
					message,
					leaveMessage: "Another One Bits The Dust!",
				},
				{
					upsert: true,
				}
			);
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.setLeave = async (guildId, guildName, channelId, leaveMessage) => {
	return await mongo().then(async (mongoose) => {
		try {
			await guildSchema.findOneAndUpdate(
				{
					guildId,
				},
				{
					guildId,
					guildName,
					channelId,
					message: "Hope You Enjoy Your Stay!",
					leaveMessage,
				},
				{
					upsert: true,
				}
			);
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.setLevel = async (guildId, guildName, levelChannelId) => {
	return await mongo().then(async (mongoose) => {
		try {
			await guildSchema.findOneAndUpdate(
				{
					guildId,
				},
				{
					guildId,
					guildName,
					levelChannelId,
				},
				{
					upsert: true,
				}
			);
		} finally {
			mongoose.connection.close();
		}
	});
};
