const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "queue",
	aliases: ["q"],
	utilisation: "queue",
	voiceChannel: true,

	execute(message, args, bot) {
		const queue = bot.player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		if (!queue.tracks[0])
			return message.channel.send(`${message.author}, No music in queue after current song. ❌`);

		const embed = new MessageEmbed();
		const methods = ["🔁", "🔂"];

		embed.setColor("RED");

		embed.setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }));
		embed.setTitle(`Server Music List - ${message.guild.name} ${methods[queue.repeatMode]}`);

		const tracks = queue.tracks.map(
			(track, i) =>
				`**${i + 1}** - ${track.title} | ${track.author} (Started by <@${track.requestedBy.id}>)`
		);

		const songs = queue.tracks.length;
		const nextSongs =
			songs > 5
				? `And **${songs - 5}** Other Song...`
				: `There are **${songs}** Songs in the List.`;

		embed.setDescription(
			`Currently Playing: *${queue.current.title}*\n\n${tracks
				.slice(0, 5)
				.join("\n")}\n\n${nextSongs}`
		);

		const ablin = bot.users.cache.find((user) => user.id === "523819929988890629");
		embed.setTimestamp();
		embed.setFooter("Bot haxxed by ablin xd", ablin.avatarURL({ dynamic: true }));

		message.channel.send({ embeds: [embed] });
	},
};
