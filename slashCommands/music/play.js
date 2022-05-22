const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");

module.exports = {
	name: "play",
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays the audio of any youtube clip.")
		.addStringOption((option) => {
			return (option = option
				.setName("song")
				.setDescription("The url (or name) of the youtube clip you want to play.")
				.setRequired(true));
		}),
	async execute(interaction, bot) {
		await interaction.deferReply();

		const { options } = interaction;
		const queue = await bot.player.createQueue(interaction.guild, {
			ytdlOptions: {
				filter: "audioonly",
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},

			metadata: interaction.channel,
		});

		const url = options.getString("song");

		const res = await bot.player.search(url, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO,
		});

		if (!res || !res.tracks.length) return interaction.followUp(`No results found! ❌`);

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			await bot.player.deleteQueue(interaction.guild.id);
			return interaction.followUp(`I can't join audio channel. ❌`);
		}

		await interaction.followUp({
			content: `${res.playlist ? "Your Playlist" : "Your Track"} is Loading... 🎧`,
		});

		res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

		if (!queue.playing) await queue.play();
	},
};
