module.exports = {
	name: "resume",
	aliases: [],
	utilisation: "resume",
	voiceChannel: true,

	execute(message, args, bot) {
		const queue = bot.player.getQueue(message.guild.id);

		if (!queue)
			return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		const success = queue.setPaused(false);

		return message.channel.send(
			success
				? `**${queue.current.title}**, The song continues to play. ✅`
				: `${message.author}, Something went wrong. ❌`
		);
	},
};
