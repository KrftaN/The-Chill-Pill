const { SlashCommandBuilder } = require("@discordjs/builders");
const wait = require("node:timers/promises").setTimeout;
const maxVol = require("../../utility/config").opt.maxVol;

module.exports = {
	name: "volume",
	voiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Changes the volume of the video.")
		.addNumberOption((option) => {
			return (option = option
				.setName("volume")
				.setDescription(`Choose a number between 1 and ${maxVol}`)
				.setRequired(true));
		}),
	async execute(interaction, bot) {
		const { options } = interaction;
		const queue = bot.player.getQueue(interaction.guild.id);

		if (!queue || !queue.playing)
			return interaction.reply(`There is no music currently playing! ❌`);

		const vol = parseInt(options.getNumber("volume"));

		if (!vol)
			return interaction.reply(
				`Current volume: **${queue.volume}** 🔊\n**To change the volume, with \`1\` to \`${maxVol}\` Type a number between.**`
			);

		if (queue.volume === vol)
			return interaction.reply(`The volume you want to change is already the current volume ❌`);

		if (vol < 0 || vol > maxVol)
			return interaction.reply(
				`**Type a number from \`1\` to \`${maxVol}\` to change the volume .** ❌`
			);

		const success = queue.setVolume(vol);

		return interaction.reply(
			success ? `Volume changed: **%${vol}**/**${maxVol}** 🔊` : `Something went wrong. ❌`
		);
	},
};
