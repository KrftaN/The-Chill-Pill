const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	name: "reactionroles",
	data: new SlashCommandBuilder()
		.setName("reactionroles")
		.setDescription("Lets people add roles via reacting to a targeted message.")
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

		const role = options.getRole("role");
		const messageId = options.getString("messageid");

		client.channels.cache.get();
	},
};
