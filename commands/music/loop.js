const { Player, QueueRepeatMode } = require("discord-player");

module.exports = {
	name: "loop",
	aliases: ["lp"],
	utilisation: "loop <queue>",
	voiceChannel: true,
	cooldown: 3,

	execute(message, args, bot) {
		args[0] = args[0] || "empty";

		const queue = bot.player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		const loopMode =
			args[0]?.toLowerCase() === "queue" || args[0].toLowerCase() === "q"
				? QueueRepeatMode.QUEUE
				: queue.repeatMode === 0
				? QueueRepeatMode.TRACK
				: QueueRepeatMode.OFF;

		const success = queue.setRepeatMode(loopMode);

		const mode =
			loopMode === QueueRepeatMode.TRACK
				? "🔂 Looping the Track"
				: loopMode === QueueRepeatMode.QUEUE
				? "🔁 🔂 Looping the Queue"
				: "⏹️ Stopped looping";

		message.reply({
			content: success ? `${mode} | Updated loop mode!` : "❌ | Could not update loop mode!",
		});
	},
};
