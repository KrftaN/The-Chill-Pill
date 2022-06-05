const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
	startReactionRoles,
} = require("../../utility/database-functions/reactionroles/start-reaction-roles");
const { uniqueId } = require("../../utility/functions/uniqueId");

module.exports = {
	name: "reactionroles",
	creator: false,
	permissions: "ADMINISTRATOR",
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
		const reactionRoleId = uniqueId();

		const emoticonRegex =
			/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
		const message = await interaction.channel.messages.fetch(messageId);

		if (emoticonRegex.test(emoticon) === false)
			return interaction.reply({ content: "You have to include a valid emoticon." });

		if (!message) return interaction.reply({ content: "You have to include a valid message id." });

		await startReactionRoles(
			messageId,
			emoticon,
			role.id,
			message.channel.id,
			interaction.guild.id,
			reactionRoleId
		);

		const embed = new MessageEmbed()
			.setTitle("Reaction Roles Setup Done")
			.setColor("#800080")
			.addFields(
				{
					name: "Message ID",
					value: messageId.toString(),
					inline: true,
				},
				{
					name: "Emoticon",
					value: emoticon.toString(),
					inline: true,
				},
				{
					name: "Guild ID",
					value: message.guild.id.toString(),
					inline: true,
				}
			)
			.addFields(
				{
					name: "Channel",
					value: `${message.channel}`,
					inline: true,
				},
				{
					name: "Reaction Role ID",
					value: `${reactionRoleId}`,
					inline: true,
				},
				{
					name: "Role",
					value: `${role}`,
					inline: true,
				}
			)
			.setTimestamp(new Date())
			.setFooter(
				"Use the help command for more useful commands.",
				interaction.user.avatarURL({ dynamic: true })
			);

		await message.react(emoticon);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
