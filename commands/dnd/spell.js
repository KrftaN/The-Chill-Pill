const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const functions = require("../../utility/functions.js");

const spells = require("../../jsonFiles/spells.json");

module.exports = {
	name: "spell",
	aliases: ["spell"],
	description: "This will read out all essential information about a spell",
	args: true,
	maxArgs: 1,
	minArgs: 1,
	usage: "<spell name>",
	cooldown: 1,
	execute(message, args) {
		function ciEquals(a, b) {
			return typeof a === "string" && typeof b === "string"
				? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
				: a === b;
		}

		let spellInfo;

		const spellName = args.join(" ");

		spells.forEach((spell) => {
			if (ciEquals(spell.name, spellName) === true) {
				spellInfo = spell;
			}
		});

		if (!spellInfo)
			return message.reply(
				functions.embedify(
					"That is not a D&D spell. Check your spelling or check the D&D spell list. (You can use the spell list command)"
				)
			);

		const compressedDesc = spellInfo.desc.split(" ").join("");

		const amountOfLetters = compressedDesc.split("").length;

		if (amountOfLetters < 1024) {
			const embed = new Discord.MessageEmbed()
				.setTitle(spellInfo.name)
				.setColor("#DC143C")
				.setThumbnail("https://i.imgur.com/u0aN19t.png")
				.addFields(
					{ inline: true, name: "Level", value: spellInfo.level },
					{ inline: true, name: "Casting Time", value: spellInfo.casting_time },
					{ inline: true, name: "Range", value: spellInfo.range },
					{ inline: true, name: "Duration", value: spellInfo.duration },
					{ inline: true, name: "School", value: spellInfo.school },
					{ inline: true, name: "Components", value: spellInfo.components },
					{
						inline: true,
						name: "Material",
						value: !spellInfo?.material ? "None" : spellInfo.material,
					},
					{ inline: true, name: "Class", value: spellInfo.class },
					{ name: "\u200B", value: "\u200B" }
				)
				.setFooter("Write ´.spelllist´ or ´.spells´")
				.setTimestamp(new Date());

			if (spellInfo?.higher_level) {
				embed.addFields(
					{
						name: "Description",
						value: spellInfo.desc,
						inline: true,
					},
					{ name: "\u200B", value: "\u200B" },
					{
						name: "**At Higher Levels**",
						value: spellInfo.higher_level,
						inline: true,
					}
				);
			} else {
				embed.addFields({
					name: "Description",
					value: spellInfo.desc,
					inline: true,
				});
			}

			message.channel.send(embed);
		} else {
			const embed = new Discord.MessageEmbed()
				.setTitle(spellInfo.name)
				.setColor("#DC143C")
				.setThumbnail("https://i.imgur.com/u0aN19t.png")
				.addFields(
					{ inline: true, name: "Level", value: spellInfo.level },
					{ inline: true, name: "Casting Time", value: spellInfo.casting_time },
					{ inline: true, name: "Range", value: spellInfo.range },
					{ inline: true, name: "Duration", value: spellInfo.duration },
					{ inline: true, name: "School", value: spellInfo.school },
					{ inline: true, name: "Components", value: spellInfo.components },
					{
						inline: true,
						name: "Material",
						value: !spellInfo?.material ? "None" : spellInfo.material,
					},
					{ inline: true, name: "Class", value: spellInfo.class },
					{ name: "\u200B", value: "\u200B" }
				)

				.setFooter("Write **.spelllist** or **.spells**")
				.setTimestamp(new Date());

			if (spellInfo?.higher_level) {
				embed.addFields(
					{ name: "\u200B", value: "\u200B" },
					{
						name: "**At Higher Levels**",
						value: spellInfo.higher_level,
						inline: true,
					}
				);
			}

			const embed2 = new Discord.MessageEmbed()
				.setTitle("Description")
				.setColor("#DC143C")
				.setDescription(spellInfo.desc)
				.setFooter("Write **.spelllist** or **.spells**")
				.setTimestamp(new Date());

			message.channel.send(embed).then(message.channel.send(embed2));
		}
	},
};