module.exports = {
	name: "skip",
	aliases: [],
	utilisation: "skip",
	voiceChannel: true,

	execute(message, args, bot) {
		const queue = bot.player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		const success = queue.skip();

		return message.channel.send(
			success
				? `**${queue.current.title}**, Skipped song ✅`
				: `${message.author}, Something went wrong ❌`
		);
	},
};
