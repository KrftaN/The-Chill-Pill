const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
	reactionRoleInformation,
} = require("../../utility/database-functions/reactionroles/reactionRoleInformation");

module.exports = {
	name: "reactionrolelist",
	creator: false,
	admin: true,
	permissions: "MANAGE_ROLES",
	data: new SlashCommandBuilder()
		.setName("reactionrolelist")
		.setDescription("Lists all the active reaction roles.")
		.addStringOption((option) => {
			return (option = option
				.setName("option")
				.setDescription("Choose the loop mode")
				.addChoices({ name: "entire guild", value: "guild" })
				.addChoices({ name: "channel", value: "channel" })
				.setRequired(true));
		}),
	async execute(interaction, bot) {
		const { options } = interaction;
		await interaction.deferReply();
		const option = options.getString("option");
		const reactionRoleMessages = await reactionRoleInformation();
		let array = new Array();

		const embed = new MessageEmbed()
			.setTitle(`Enabled Reaction Roles in this ${option}:`)
			.setColor("#800080")
			.setTimestamp(new Date())
			.setFooter(
				"Use the help command for more useful commands.",
				interaction.user.avatarURL({ dynamic: true })
			);

		reactionRoleMessages.forEach((reactionRole) => {
			if (interaction.guild.id !== reactionRole.guild) return;
			if (option === "channel" && interaction.channel.id !== reactionRole.channel) return;

			const role = bot.guilds.cache
				.get(reactionRole.guild)
				.roles.cache.find((role) => role.id === reactionRole.role);
			array.push(
				`\n**Reaction role ID: ${reactionRole.uniqueId}**\nEmoji: ${reactionRole.emoticon}\nMessage ID: ${reactionRole.id}\nRole: ${role}\nDirect link: [Click here!](https://discord.com/channels/${reactionRole.guild}/${reactionRole.channel}/${reactionRole.id})`
			);
		});

		if (array.join("").split("").length < 2300) {
			embed.setDescription(
				array.length === 0 ? `There are no reaction roles in this ${option}` : array.join("\n")
			);

			await interaction.followUp({ embeds: [embed], ephemeral: true });
		} else {
			const leftSide = array.splice(0, Math.ceil(array.length / 2));
			const rightSide = array;
			embed.setDescription(
				array.length === 0 ? `There are no reaction roles in this ${option}` : leftSide.join("\n")
			);
			const embed2 = new MessageEmbed()
				.setColor("#800080")
				.setDescription(rightSide.join("\n"))
				.setTimestamp(new Date())
				.sEtFooter(
					"Use the help command for more useful commands.",
					interaction.user.avatarURL({ dynamic: true })
				);
			await interaction.followUp({ embeds: [embed, embed2], ephemeral: true });
		}
	},
};
