const { SlashCommandBuilder } = require("@discordjs/builders");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
	name: "say",
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Makes the bot send a custom message")
		.addStringOption((option) => {
			return (option = option
				.setName("message")
				.setDescription("Write the message you want the bot to send")
				.setRequired(true));
		}),
	async execute(interaction) {
		const { options } = interaction;

		const message = options.getString("message");

		await interaction.channel.send(message.toString());
		await interaction.reply({
			content: `✅Successfully sent: \`${message.toString()}\``,
			ephemeral: true,
		});
	},
};
