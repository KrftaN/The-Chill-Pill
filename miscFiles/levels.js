const mongo = require("../utility/mongo");
const lvlSchema = require("../schemas/lvlSchema");

module.exports = (bot) => {
	bot.on("message", (message) => {
		const { guild, member } = message;

		addXP(
			guild.id,
			member.id,
			message.author.username,
			Math.floor(Math.random() * 20) + 1,
			message
		);
	});
};

const getNeededXP = (level) => level * level * 100;

const addXP = async (guildId, userId, userName, xpToAdd) => {
	await mongo().then(async (mongoose) => {
		try {
			const result = await lvlSchema.findOneAndUpdate(
				{
					guildId,
					userName,
					userId,
				},
				{
					guildId,
					userId,
					userName,
					$inc: {
						xp: xpToAdd,
					},
				},
				{ upsert: true }
			);

                console.log(result);

			let { xp, level } = result;
			const needed = getNeededXP(level);

			if (xp >= needed) {
				++levels;
				xo -= needed;

				message.reply(`You just leveled up! Current level: ${level} with ${xp}.`);

				await levelSchema.updateOne(
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
