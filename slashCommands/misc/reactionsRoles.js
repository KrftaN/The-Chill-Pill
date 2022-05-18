const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "reactionRoles",
	data: new SlashCommandBuilder()
		.setName("reactionroles")
		.setDescription("Let's people add roles via reacting to a targeted message.")
		.addNumberOption((option) => {
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
		}),
	async execute(interaction) {
		const { options } = interaction;

		const messageId = options.getRole("role");

		client.channels.cache.get();
	},
};
