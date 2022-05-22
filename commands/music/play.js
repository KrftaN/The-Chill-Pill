const { QueryType } = require("discord-player");

module.exports = {
	name: "play",
	aliases: ["p"],
	utilisation: "play [song name/URL]",
	voiceChannel: true,

	async execute(message, args, bot) {
		const res = await bot.player.search(args.join(" "), {
			requestedBy: message.member,
			searchEngine: QueryType.AUTO,
		});

		if (!res || !res.tracks.length)
			return message.channel.send(`${message.author}, No results found! ❌`);

		const queue = await bot.player.createQueue(message.guild, {
			metadata: message.channel,
		});

		try {
			if (!queue.connection) await queue.connect(message.member.voice.channel);
		} catch {
			await bot.player.deleteQueue(message.guild.id);
			return message.channel.send(`${message.author}, I can't join audio channel. ❌`);
		}

		res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		await message.channel.send(
			`Your ${res.playlist ? "Your Playlist" : "Your Track"} Loading... 🎧`
		);

		if (!queue.playing) await queue.play();
	},
};
