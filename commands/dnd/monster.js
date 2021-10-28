const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const functions = require("../../utility/functions.js");

const monsters = require("../../jsonFiles/monsters.json");

module.exports = {
	name: "monster",
	aliases: [],
	description: "This is a description",
	args: true,
	maxArgs: 1,
	minArgs: 1,
	cooldown: 1,
	async execute(message, args, guild) {
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
					functions.embedify(
						"That is not a available monster. Either you spelled it wrong, or that's not a SRD licensed monster. Use the command `monsterlist` to view all available monsters"
					),
				],
			});

		const overview = new Discord.MessageEmbed()
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
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		const actions = new Discord.MessageEmbed()
			.setTitle("Actions")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.actions}`)
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		const traits = new Discord.MessageEmbed()
			.setTitle("Traits")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.traits}`)
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		const legendary_actions = new Discord.MessageEmbed()
			.setTitle("Legendary Actions")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.legendary_actions}`)
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		const reactions = new Discord.MessageEmbed()
			.setTitle("Reactions")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.reactions}`)
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		const array = new Array();

		if (monsterInfo?.traits) {
			array.push(traits);

			//message.channel.send(traits);
		}

		if (monsterInfo?.actions) {
			array.push(actions);

			//message.channel.send(actions);
		}

		if (monsterInfo?.reactions) {
			array.push(reactions);

			//message.channel.send(reactions);
		}

		if (monsterInfo?.legendary_actions) {
			array.push(legendary_actions);

			//message.channel.send(legendary_actions);
		}

		message.channel.send({ embeds: [overview, ...array] }); //
	},
};
