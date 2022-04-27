const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "nowplaying",
	aliases: ["np"],
	utilisation: "{prefix}nowplaying",
	voiceChannel: true,

	execute(message, args, guild, bot, folders) {
		const queue = bot.player.getQueue(message.guild.id);

		if (!queue || !queue.playing)
			return message.channel.send(`${message.author}, There is no music currently playing!. ❌`);

		const track = queue.current;

		const embed = new MessageEmbed();

		embed.setColor("RED");
		embed.setThumbnail(track.thumbnail);
		embed.setTitle(track.title);

		const methods = ["disabled", "track", "queue"];

		const timestamp = queue.getPlayerTimestamp();
		const trackDuration = timestamp.progress == "Forever" ? "Endless (Live)" : track.duration;

		embed.setDescription(
			`Audio **%${queue.volume}**\nDuration **${trackDuration}**\nLoop Mode **${
				methods[queue.repeatMode]
			}**\n${track.requestedBy}`
		);

		embed.setTimestamp();
		embed.setFooter("Shit bot", message.author.avatarURL({ dynamic: true }));

		const saveButton = new MessageButton();

		saveButton.setLabel("This button does fucking nothing");
		saveButton.setCustomId("saveTrack");
		saveButton.setStyle("SUCCESS");

		const row = new MessageActionRow().addComponents(saveButton);

		message.channel.send({ embeds: [embed], components: [row] });
	},
};
