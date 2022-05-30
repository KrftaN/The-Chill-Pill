module.exports = {
	name: "clearqueue",
	aliases: ["cq"],
	description: "Clear the queue",
	args: false,
	cooldown: 1,

	async execute(message, args, bot) {
		const queue = bot.player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, No music currently playing. ❌`);

		if (!queue.tracks[0])
			return message.channel.send(
				`${message.author}, There is already no music in queue after the current one ❌`
			);

		await queue.clear();

		message.channel.send(`The queue has just been cleared. 🗑️`);
	},
};
