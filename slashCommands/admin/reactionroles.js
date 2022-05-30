const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "reactionroles",
	creator: true,
	data: new SlashCommandBuilder()
		.setName("reactionroles")
		.setDescription("Lets people add roles via reacting to a targeted message.")
		.addStringOption((option) => {
			return (option = option
				.setName("messageid")
				.setDescription("Select the amount of messages to delete from a channel or target.")
				.setRequired(true));
		})
		.addRoleOption((option) => {
			return (option = option
				.setName("role")
				.setDescription("Choose the role which the user will be given/withdrawn if they react")
				.setRequired(true));
		})
		.addStringOption((option) => {
			return (option = option
				.setName("emoticon")
				.setDescription("Choose the emoticon associated with the role.")
				.setRequired(true));
		}),
	async execute(interaction) {
		const { options } = interaction;

		const role = options.getRole("role");
		const messageId = options.getString("messageid");
		const emoticon = options.getString("emoticon");
		const emoticonRegex =
			/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

		if (emoticonRegex.test(emoticon) === false)
			return interaction.reply({ content: "You have to include a valid emoticon." });

		if (!interaction.channel.messages.fetch(messageId))
			return interaction.reply({ content: "You have to include a valid message id." });

		await interaction.reply({ content: "It passed all the checks." });
	},
};
