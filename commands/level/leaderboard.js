const Levels = require("discord-xp");

module.exports = {
	name: "leaderboard",
	aliases: ["leaderboard", "ranks"],
	description: "This is a leaderboard of all ranks on a server",
	args: false,
	maxArgs: 1,
	cooldown: 1,
	async execute(message, args, bot) {
		const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.

		if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

		const leaderboard = await Levels.computeLeaderboard(bot, rawLeaderboard, true); // We process the leaderboard.

		const lb = leaderboard.map(
			(e) =>
				`${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
					e.level
				}\nXP: ${e.xp.toLocaleString()}`
		); // We map the outputs.

		message.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
	},
};
