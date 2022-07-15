const { MessageEmbed } = require("discord.js");
const { embedify } = require("../../utility/functions/embedify");
const { getCharacterCount } = require("../../utility/functions/getCharacterCount");
const { ciEquals } = require("../../utility/functions/ciEquals");
const { prefix } = require("../../jsonFiles/config.json");
const spells = require("../../jsonFiles/spells.json");

module.exports = {
	name: "spell",
	aliases: [],
	description: "This will read out all essential information about a spell",
	args: true,
	maxArgs: 1,
	minArgs: 1,
	usage: "<spell name>",
	cooldown: 1,
	execute(message, args) {
		let spellInfo;

		const spellName = args.join(" ");

		spells.forEach((spell) => {
			if (ciEquals(spell.name, spellName) === true) {
				spellInfo = spell;
			}
		});

		if (!spellInfo) {
			message.delete();
			return message
				.reply({
					embeds: [
						embedify(
							"That is not a available spell. Either you spelled it wrong, or that's not a SRD licensed spell. Use the command `spelllist` to view all available spells"
						),
					],
				})
				.then((message) => {
					setTimeout(() => message.delete(), 10 * 1000);
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

			message.channel.send({ embeds: [embed] });
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

			message.channel.send({ embeds: [embed, embed2] });
		}
	},
};
