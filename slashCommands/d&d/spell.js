const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const spells = require("../../jsonFiles/spells.json");
const { prefix } = require("../../jsonFiles/config.json");
const { ciEquals } = require("../../utility/functions/ciEquals");
const { embedify } = require("../../utility/functions/embedify");
const { getCharacterCount } = require("../../utility/functions/getCharacterCount");

module.exports = {
	name: "spell",
	data: new SlashCommandBuilder()
		.setName("spell")
		.setDescription("Displays a spell from Dungeons and Dragons 5e.")
		.addStringOption((option) => {
			return (option = option
				.setName("spell")
				.setDescription("Enter the name of the spell.")
				.setRequired(true));
		}),
	async execute(interaction, bot) {
		const { options } = interaction;

		const spellName = options.getString("spell");

		let spellInfo;

		spells.forEach((spell) => {
			if (ciEquals(spell.name, spellName) === true) {
				spellInfo = spell;
			}
		});

		if (!spellInfo) {
			return interaction.reply({
				embeds: [
					embedify(
						"That is not an available spell. Either you spelled it wrong, or that's not a SRD licensed spell. Use the command `spelllist` to view all available spells"
					),
				],
			});
		}

		if (getCharacterCount(spellInfo.desc) <= 1024) {
			const embed = new MessageEmbed()
				.setTitle(spellInfo.name)
				.setColor("#DC143C")
				.setThumbnail("https://i.imgur.com/u0aN19t.png")
				.addFields(
					{ inline: true, name: "Level", value: spellInfo.level.toString() },
					{ inline: true, name: "Casting Time", value: spellInfo.casting_time.toString() },
					{ inline: true, name: "Concentration", value: spellInfo.concentration.toString() },
					{ inline: true, name: "Range", value: spellInfo.range.toString() },
					{ inline: true, name: "Duration", value: spellInfo.duration.toString() },
					{ inline: true, name: "School", value: spellInfo.school.toString() },
					{ inline: true, name: "Components", value: spellInfo.components.toString() },
					{
						inline: true,
						name: "Material",
						value: !spellInfo?.material ? "None" : spellInfo.material.toString(),
					},
					{ inline: true, name: "Class", value: spellInfo.class.toString() },
					{ name: "\u200B", value: "\u200B" }
				)
				.setFooter({ text: `Use the ${prefix}spelllist for more spells` })
				.setTimestamp(new Date());

			if (spellInfo?.higher_level) {
				embed.addFields(
					{
						name: "Description",
						value: spellInfo.desc.toString(),
						inline: true,
					},
					{ name: "\u200B", value: "\u200B" },
					{
						name: "**At Higher Levels**",
						value: spellInfo.higher_level.toString(),
						inline: true,
					}
				);
			} else {
				embed.addFields({
					name: "Description",
					value: spellInfo.desc.toString(),
					inline: true,
				});
			}

			interaction.reply({ embeds: [embed] });
		} else {
			const embed = new MessageEmbed()
				.setTitle(spellInfo.name.toString())
				.setColor("#DC143C")
				.setThumbnail("https://i.imgur.com/u0aN19t.png")
				.addFields(
					{ inline: true, name: "Level", value: spellInfo.level.toString() },
					{ inline: true, name: "Casting Time", value: spellInfo.casting_time.toString() },
					{ inline: true, name: "Concentration", value: spellInfo.concentration.toString() },
					{ inline: true, name: "Range", value: spellInfo.range.toString() },
					{ inline: true, name: "Duration", value: spellInfo.duration.toString() },
					{ inline: true, name: "School", value: spellInfo.school.toString() },
					{ inline: true, name: "Components", value: spellInfo.components.toString() },
					{
						inline: true,
						name: "Material",
						value: !spellInfo?.material ? "None" : spellInfo.material.toString(),
					},
					{ inline: true, name: "Class", value: spellInfo.class.toString() }
				);

			if (spellInfo?.higher_level) {
				embed.addFields(
					{ name: "\u200B", value: "\u200B" },
					{
						name: "**At Higher Levels**",
						value: spellInfo.higher_level.toString(),
						inline: true,
					}
				);
			}

			const embed2 = new MessageEmbed()
				.setTitle("Description")
				.setColor("#DC143C")
				.setDescription(spellInfo.desc.toString())
				.setFooter({ text: `Use the ${prefix}spelllist for more spells` })
				.setTimestamp(new Date());

			interaction.reply({ embeds: [embed, embed2] });
		}
	},
};
