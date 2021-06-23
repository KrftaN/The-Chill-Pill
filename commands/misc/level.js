const Levels = require("discord-xp");
const mongo = require("../../utility/mongo.js");

module.exports = {
	name: "level",
	aliases: ["level", "rank"],
	description: "This checks the users level",
	args: false,
	manArgs: 1,
	cooldown: 1,
	usage: "<@someone>",
	async execute (message, args) {
		await mongo().then(async (mongoose) => {
			try {
				const target = message.mentions.users.first() || message.author; // Grab the target.

				const user = await Levels.fetch(target.id, message.guild.id); // Selects the target from the database.

				if (!user)
					return message.channel.send("Seems like this user has not earned any xp so far."); // If there isnt such user in the database, we send a message in general.

				message.channel.send(`> **${target.tag}** is currently level **${user.level}** in **${message.guild.name}**`); // We show the level.
			} finally {
				mongoose.connection.close();
			}
		});
	},
};
