const mongo = require("../../mongo");
const scheduleSchema = require("../../../schemas/scheduleSchema");

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
		} finally {
			mongoose.connection.close();
		}
	});
};
