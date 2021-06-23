const mongo = require("../utility/mongo");
const lvlSchema = require("../schemas/lvlSchema");

module.exports = (bot) => {
	bot.on("message", (message) => {
		const { guild, member } = message;

		addXP(guild.id, member.id, 23, message);
	});
};

const getNeededXP = (level) => level * level * 100;

module.exports.addXP = async (guildId, userId, xpToAdd, message) => {
	await mongo().then(async (mongoose) => {
		try {
			const result = await lvlSchema.findOneAndUpdate(
				{
					guildId,
					userId,
				},
				{
					guildId,
					userId,
					$inc: {
						xp: xpToAdd,
					},
				},
				{
					upsert: true,
					new: true,
				}
			);

			let { xp, level } = result;
			const needed = getNeededXP(level);
			if (xp >= needed) {
				++level;
				xp -= needed;

				message.reply(
					`You are now level ${level} with ${xp} experience! You now need ${getNeededXP(
						level
					)} XP to level up again.`
				);

				await lvlSchema.updateOne(
					{
						guildId,
						userId,
					},
					{
						level,
						xp,
					}
				);
			}
		} finally {
			mongoose.connection.close();
		}
	});
};

module.exports.addXP = addXP
