const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
	deleteManyReactionRoles,
} = require("../../utility/database-functions/reactionroles/deleteManyReactionRoles");
const {
	reactionRoleInformation,
} = require("../../utility/database-functions/reactionroles/reactionRoleInformation");
const { cacheMessages } = require("../../utility/onReady/cacheMessages");

module.exports = {
	name: "clearallreactionroles",
	creator: false,
	admin: true,
	permissions: "MANAGE_ROLES",
	data: new SlashCommandBuilder()
		.setName("clearallreactionroles")
		.setDescription("Lets people add roles via reacting to a targeted message.") // BOOLEAN
		.addBooleanOption((option) => {
			return (option = option
				.setName("delete")
				.setDescription("Choose whether or not to delete all of the original messages.")
				.setRequired(false));
		}),
	async execute(interaction, bot) {
		await interaction.deferReply();
		await cacheMessages(bot).then(async () => {
			const { options } = interaction;
			const deleteBoolean = options.getBoolean("delete");
			const allMessageIds = await reactionRoleInformation();
			let guildMessageUniqueIds = new Array();
			let guildMessages = new Array();

			await Promise.all(
				allMessageIds.map(async (message) => {
					if (message.guild === interaction.guild.id) {
						guildMessageUniqueIds.push(message.uniqueId);
						guildMessages.push(message);
					}
				})
			);

			if (deleteBoolean === true) {
				guildMessages.forEach(async (reactionRoleMessage) => {
					const msg = await bot.guilds.cache
						.get(reactionRoleMessage.guild)
						.channels.cache.get(reactionRoleMessage.channel)
						.messages.fetch(reactionRoleMessage.id);

					msg.delete();
				});
			}
			await deleteManyReactionRoles(guildMessageUniqueIds);
			const embed = new MessageEmbed()
				.setTitle("Successfully cleared all reaction roles!")
				.setColor("#800080")
				.setTimestamp(new Date())
				.setFooter(
					"Use the help command for more useful commands.",
					interaction.user.avatarURL({ dynamic: true })
				);

			await interaction.followUp({ embeds: [embed], ephemeral: true });
		});
	},
};
