const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
	deleteReactionRole,
} = require("../../utility/database-functions/reactionroles/deleteReactionRole");
const {
	getReactionRole,
} = require("../../utility/database-functions/reactionroles/getReactionRole");

module.exports = {
	name: "deletereactionrole",
	creator: false,
	permissions: "MANAGE_ROLES",
	data: new SlashCommandBuilder()
		.setName("deletereactionrole")
		.setDescription("Lets people add roles via reacting to a targeted message.") // BOOLEAN
		.addStringOption((option) => {
			return (option = option
				.setName("messagelink")
				.setDescription("Input the message link to the reaction role you want to remove.")
				.setRequired(true));
		})
		.addBooleanOption((option) => {
			return (option = option
				.setName("delete")
				.setDescription("Choose whether  or not to delete the original message.")
				.setRequired(false));
		}),
	async execute(interaction, bot) {
		const { options } = interaction;

		const deleteBoolean = options.getBoolean("delete");
		const messagelink = options.getString("messagelink");
		const messageId = messagelink.split("/")[6];
		const channelId = messagelink.split("/")[5];
		const guildId = messagelink.split("/")[4];

		try {
			const message = await bot.guilds.cache
				.get(guildId)
				.channels.cache.get(channelId)
				.messages.fetch(messageId);

			if (!message)
				return interaction.reply({ content: "You have to include a valid message id." });

			if (deleteBoolean === true) {
				message.delete();
			} else {
				message.reactions
					.removeAll()
					.catch((error) => console.error("Failed to clear reactions:", error));
			}

			const data = await getReactionRole(messageId);

			await deleteReactionRole(data.uniqueId);

			const embed = new MessageEmbed()
				.setTitle("Successfully deleted the reaction role")
				.setColor("#800080")
				.addFields(
					{
						name: "Message ID",
						value: messageId.toString(),
						inline: true,
					},
					{
						name: "Emoticon",
						value: data.emoticon.toString(),
						inline: true,
					},
					{
						name: "Guild ID",
						value: message.guild.id.toString(),
						inline: true,
					}
				)
				.setTimestamp(new Date())
				.setFooter(
					"Use the help command for more useful commands.",
					interaction.user.avatarURL({ dynamic: true })
				);

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err) {
			interaction.reply({ content: "You have to include a valid message id." });
		}
	},
};
