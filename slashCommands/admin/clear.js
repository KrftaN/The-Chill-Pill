const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "clear",
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("This will clear messages")
		.addNumberOption((option) => {
			return (option = option
				.setName("amount")
				.setDescription("Select the amount of messages to delete from a channel or target.")
				.setRequired(true));
		})
		.addUserOption((option) => {
			return (option = option
				.setName("target")
				.setDescription("Select a target to clear their messages")
				.setRequired(false));
		}),
	async execute(interaction) {
		const { channel, options } = interaction;

		const amount = options.getNumber("amount");
		const target = options.getMember("target");

		const messages = await channel.messages.fetch();

		const response = new MessageEmbed().setColor("#FF0000");

		if (amount > 100 || amount <= 0) {
			Response.setDescription(`Amount cannot exceed 100, and cannot be under 1.`);
			return interaction.reply({ embeds: [Response] });
		}
		try {
			if (target) {
				let i = 0;
				const filtered = new Array();
				await messages.filter((m) => {
					if (m.author.id === target.id && amount > i) {
						filtered.push(m);
						i++;
					}
				});

				await channel.bulkDelete(filtered, true).then((messages) => {
					response.setDescription(`🧹 Cleared ${messages.size} from ${target}`);
					interaction.reply({ embeds: [response], ephemeral: true });
				});
			} else {
				await channel.bulkDelete(amount, true).then((messages) => {
					response.setDescription(`🧹 Cleared ${messages.size} from this channel`);
					interaction.reply({ embeds: [response], ephemeral: true });
				});
			}
		} catch (err) {
			console.log(err);
		}
	},
};
