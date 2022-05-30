const { SlashCommandBuilder } = require("@discordjs/builders");
const wait = require("node:timers/promises").setTimeout;
const { Player, QueueRepeatMode } = require("discord-player");

module.exports = {
	name: "loop",
	voiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loops the current track or queue.")
		.addStringOption((option) => {
			return (option = option
				.setName("mode")
				.setDescription("Choose the loop mode")
				.addChoices({ name: "track", value: "track" })
				.addChoices({ name: "queue", value: "queue" })
				.addChoices({ name: "off", value: "off" })
				.setRequired(true));
		}),
	async execute(interaction, bot) {
		const { options } = interaction;
		const queue = bot.player.getQueue(interaction.guild.id);

		const loopMode =
			options.getString("mode") === "queue"
				? QueueRepeatMode.QUEUE
				: options.getString("mode") === "track"
				? QueueRepeatMode.TRACK
				: QueueRepeatMode.OFF;

		if (!queue || !queue.playing)
			return interaction.reply({ content: `There is no music currently playing! ❌` });

		const success = queue.setRepeatMode(loopMode);

		const mode =
			loopMode === QueueRepeatMode.TRACK
				? "🔂 Looping the Track"
				: loopMode === QueueRepeatMode.QUEUE
				? "🔁 Looping the Queue"
				: "⏹️ Stopped looping";

		await interaction.reply({
			content: success ? `${mode} | Updated loop mode!` : "❌ | Could not update loop mode!",
		});
	},
};
