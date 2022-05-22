module.exports = {
	name: "pause",
	aliases: [],
	utilisation: "pause",
	voiceChannel: true,

	execute(message, args, bot) {
		const queue = bot.player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		const success = queue.setPaused(true);

		return message.channel.send(
			success
				? `The currently playing music named **${queue.current.title}** has stopped ✅`
				: `${message.author}, Something went wrong. ❌`
		);
	},
};
