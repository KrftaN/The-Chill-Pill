const { SlashCommandBuilder } = require("@discordjs/builders");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
	name: "dm",
	data: new SlashCommandBuilder()
		.setName("dm")
		.setDescription("Makes the bot send a custom direct message to a designated user.")
		.addStringOption((option) => {
			return (option = option
				.setName("message")
				.setDescription("Write the message you want the bot to send to the designated user")
				.setRequired(true));
		})
		.addUserOption((option) => {
			return (option = option
				.setName("user")
				.setDescription("The user that will receive the message.")
				.setRequired(true));
		}),
	async execute(interaction) {
		const { options } = interaction;

		const message = options.getString("message");
		const user = options.getUser("user");

		await user.send(message.toString());

		await interaction.reply({
			content: `✅Successfully sent: \`${message.toString()}\` to \`${user.username}\``,
			ephemeral: true,
		});
	},
};
