const { MessageEmbed } = require("discord.js");
const { embedify } = require("../../utility/functions/embedify");
const { prefix } = require("../../jsonFiles/config.json");
const monsters = require("../../jsonFiles/monsters.json");

module.exports = {
	name: "monster",
	aliases: [],
	description: "This is a description",
	args: true,
	maxArgs: 1,
	minArgs: 1,
	cooldown: 1,
	async execute(message, args) {
		function ciEquals(a, b) {
			return typeof a === "string" && typeof b === "string"
				? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
				: a === b;
		}

		let monsterInfo;

		const monsterName = args.join(" ");

		monsters.forEach((monster) => {
			if (ciEquals(monster.name, monsterName) === true) {
				monsterInfo = monster;
			}
		});

		if (!monsterInfo)
			return message.reply({
				embeds: [
					embedify(
						"That is not a available monster. Either you spelled it wrong, or that's not a SRD licensed monster. Use the command `monsterlist` to view all available monsters"
					),
				],
			});

		const overview = new MessageEmbed()
			.setTitle(`${monsterInfo.name}`)
			.setColor("#DC143C")
			.setThumbnail(monsterInfo.img_url)
			.setDescription(`${monsterInfo.meta}`)
			.addFields(
				{ inline: false, name: "Armor Class", value: monsterInfo.armor_class.toString() },
				{ inline: false, name: "Hit Points", value: monsterInfo.hit_points.toString() },
				{ inline: false, name: "Speed", value: monsterInfo.speed.toString() },

				{ name: "\u200B", value: "\u200B" },

				{
					inline: true,
					name: "STR",
					value: `${monsterInfo.STR} ${monsterInfo.STR_mod}`,
				},
				{
					inline: true,
					name: "DEX",
					value: `${monsterInfo.DEX} ${monsterInfo.DEX_mod}`,
				},
				{
					inline: true,
					name: "CON",
					value: `${monsterInfo.CON} ${monsterInfo.CON_mod}`,
				},
				{
					inline: true,
					name: "INT",
					value: `${monsterInfo.INT} ${monsterInfo.INT_mod}`,
				},
				{
					inline: true,
					name: "WIS",
					value: `${monsterInfo.WIS} ${monsterInfo.WIS_mod}`,
				},
				{
					inline: true,
					name: "CHA",
					value: `${monsterInfo.CHA} ${monsterInfo.CHA_mod}`,
				},

				{ name: "\u200B", value: "\u200B" },

				{
					name: "Saving Throw",
					value: !monsterInfo?.saving_throws ? "None" : monsterInfo.saving_throws.toString(),
				},
				{
					name: "Skills",
					value: !monsterInfo?.skills ? "None" : monsterInfo.skills.toString(),
				},
				{
					inline: true,
					name: "Damage Resistances ",
					value: !monsterInfo?.damage_resistances
						? "None"
						: monsterInfo.damage_resistances.toString(),
				},
				{
					inline: true,
					name: "Damage Immunities",
					value: !monsterInfo?.damage_immunities
						? "None"
						: monsterInfo.damage_immunities.toString(),
				},
				{
					inline: true,
					name: "Condition Immunities",
					value: !monsterInfo?.condition_immunities
						? "None"
						: monsterInfo.condition_immunities.toString(),
				},
				{ name: "Senses", value: monsterInfo.senses.toString() },
				{ name: "Languages", value: monsterInfo.languages.toString() },
				{ name: "Challange", value: monsterInfo.challange.toString() },
				{ name: "\u200B", value: "\u200B" }
			)
			.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
			.setTimestamp(new Date());

		const actions = new MessageEmbed()
			.setTitle("Actions")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.actions}`);

		const actions_Continuation = new MessageEmbed()
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.actions}`)
			.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
			.setTimestamp(new Date());

		const traits = new MessageEmbed()
			.setTitle("Traits")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.traits}`);

		const traits_Continuation = new MessageEmbed()
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.traits}`)
			.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
			.setTimestamp(new Date());

		const legendary_actions = new MessageEmbed()
			.setTitle("Legendary Actions")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.legendary_actions}`);

		const legendary_actions_Continuation = new MessageEmbed()
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.legendary_actions}`)
			.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
			.setTimestamp(new Date());

		const reactions = new MessageEmbed()
			.setTitle("Reactions")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.reactions}`);

		const reactions_Continuation = new MessageEmbed()
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.reactions}`)
			.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
			.setTimestamp(new Date());

		const array = new Array();

		if (monsterInfo?.traits) {
			if (monsterInfo?.traits.split("").length > 2300) {
				const sentences = monsterInfo?.traits.split(".");
				const leftSide = sentences.splice(0, Math.ceil(sentences.length / 2));
				const rightSide = sentences;

				traits.setDescription(leftSide.toString());
				traits_Continuation.setDescription(rightSide.toString());

				array.push(traits);
				array.push(traits_Continuation);
			} else {
				traits
					.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
					.setTimestamp(new Date());
				array.push(traits);
			}
		}

		if (monsterInfo?.actions) {
			if (monsterInfo?.actions.split("").length > 2300) {
				const sentences = monsterInfo?.actions.split(".");
				const leftSide = sentences.splice(0, Math.ceil(sentences.length / 2));
				const rightSide = sentences;

				actions.setDescription(leftSide.toString());
				actions_Continuation.setDescription(rightSide.toString());

				array.push(actions);
				array.push(actions_Continuation);
			} else {
				actions
					.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
					.setTimestamp(new Date());
				array.push(actions);
			}
		}

		if (monsterInfo?.reactions) {
			if (monsterInfo?.reactions.split("").length > 2300) {
				const sentences = monsterInfo?.reactions.split(".");
				const leftSide = sentences.splice(0, Math.ceil(sentences.length / 2));
				const rightSide = sentences;

				reactions.setDescription(leftSide.toString());
				reactions_Continuation.setDescription(rightSide.toString());

				array.push(reactions);
				array.push(reactions_Continuation);
			} else {
				reactions
					.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
					.setTimestamp(new Date());
				array.push(reactions);
			}
		}

		if (monsterInfo?.legendary_actions) {
			if (monsterInfo?.legendary_actions.split("").length > 2300) {
				const sentences = monsterInfo?.legendary_actions.split(".");
				const leftSide = sentences.splice(0, Math.ceil(sentences.length / 2));
				const rightSide = sentences;

				legendary_actions.setDescription(leftSide.toString());
				legendary_actions_Continuation.setDescription(rightSide.toString());

				array.push(legendary_actions);
				array.push(legendary_actions_Continuation);
			} else {
				legendary_actions
					.setFooter(`Write ${prefix}monsterlist or ${prefix}monsters`)
					.setTimestamp(new Date());
				array.push(legendary_actions);
			}
		}

		const firstHalf = array.splice(0, Math.ceil(array.length / 2));
		const secondHalf = array;

		message.channel
			.send({ embeds: [overview, ...firstHalf] })
			.then(message.channel.send({ embeds: [...secondHalf] }));
	},
};
