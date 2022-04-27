const { QueryType } = require("discord-player");

module.exports = {
	name: "play",
	aliases: ["p"],
	utilisation: "{prefix}play [song name/URL]",
	voiceChannel: true,

	async execute(message, args, guild, bot, folders) {
/* 		const Guild = bot.guilds.cache.get(guild.id);

		const Member = Guild.members.cache.get(message.author.id);
		const Bot = Guild.members.cache.get(bot.user.id);

		if (Member.voice.channel.id !== Bot.voice.channel.id)
			return message.channel.send("You have to be connected to a voice channel!"); */

		if (!args[0])
			return message.channel.send(
				`${message.author}, Write the name of the music you want to search. ❌`
			);

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

		await message.channel.send(
			`Your ${res.playlist ? "Your Playlist" : "Your Track"} Loading... 🎧`
		);

		res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (!queue.playing) await queue.play();
	},
};
