const { Player } = require("discord-player");

module.exports = {
	name: "loop",
	aliases: ["lp"],
	utilisation: "{prefix}loop <queue>",
	voiceChannel: true,
	cooldown: 3,

	execute(message, args, guild, bot, folders) {
		const queue = bot.player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		if (args.join("").toLowerCase() === "queue") {
			if (queue.repeatMode === 1)
				return message.channel.send(
					`${message.author}, You should disable loop mode of existing music first **(${bot.config.px}loop)** ❌`
				);

			const success = queue.setRepeatMode(
				queue.repeatMode === 0 ? Player.QueueRepeatMode.QUEUE : Player.QueueRepeatMode.OFF
			);

			return message.channel.send(
				success
					? `Loop Mode: **${
							queue.repeatMode === 0 ? "Inactive" : "Active"
					  }**, The whole sequence will repeat non-stop 🔁`
					: `${message.author}, Something went wrong. ❌`
			);
		} else {
			if (queue.repeatMode === 2)
				return message.channel.send(
					`${message.author}, In Loop mode you must disable existing queue first **(${bot.config.px}loop queue)** ❌`
				);

			const success = queue.setRepeatMode(
				queue.repeatMode === 0 ? Player.QueueRepeatMode.TRACK : Player.QueueRepeatMode.OFF
			);

			return message.channel.send(
				success
					? `Loop Mode: **${
							queue.repeatMode === 0 ? "Inactive" : "Active"
					  }**, Current music will be repeated non-stop (all music in the list **${
							bot.config.px
					  }loop queue**  You can repeat it with the option.) 🔂`
					: `${message.author}, Something went wrong ❌`
			);
		}
	},
};
