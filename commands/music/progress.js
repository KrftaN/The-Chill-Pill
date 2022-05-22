module.exports = {
	name: "progress",
	aliases: ["time"],
	utilisation: "progress",
	voiceChannel: true,

	async execute(message, args, bot) {
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, There is no music currently playing! ❌`);

		const progress = queue.createProgressBar();
		const timestamp = queue.getPlayerTimestamp();

		if (timestamp.progress == "Infinity")
			return message.channel.send(`This song is live streaming, no duration data to display. 🎧`);

		message.channel.send(`${progress} (**${timestamp.progress}**%)`);
	},
};
