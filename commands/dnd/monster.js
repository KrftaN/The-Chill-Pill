const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const functions = require("../../utility/functions.js");

const monsters = require("../../jsonFiles/monsters.json");

module.exports = {
	name: "monster",
	aliases: ["monster"],
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
			return message.reply(
				functions.embedify(
					"That is not a D&D . Check your spelling or check the D&D spell list. (You can use the monster list command)"
				)
			);

		const embed = new Discord.MessageEmbed()
			.setTitle(monsterInfo.name)
			.setColor("#DC143C")
			.setThumbnail(monsterInfo.img_url)
			.setDescription(monsterInfo.meta)
			.addFields(
				{ inline: false, name: "Armor Class", value: monsterInfo.armor_class },
				{ inline: false, name: "Hit Points", value: monsterInfo.hit_points },
				{ inline: false, name: "Speed", value: monsterInfo.speed },

				{ name: "\u200B", value: "\u200B" },

				{ inline: true, name: "STR", value: `${monsterInfo.STR} ${monsterInfo.STR_mod}` },
				{ inline: true, name: "DEX", value: `${monsterInfo.DEX} ${monsterInfo.DEX_mod}` },
				{ inline: true, name: "CON", value: `${monsterInfo.CON} ${monsterInfo.CON_mod}` },
				{ inline: true, name: "INT", value: `${monsterInfo.INT} ${monsterInfo.INT_mod}` },
				{ inline: true, name: "WIS", value: `${monsterInfo.WIS} ${monsterInfo.WIS_mod}` },
				{ inline: true, name: "CHA", value: `${monsterInfo.CHA} ${monsterInfo.CHA_mod}` },

				{ name: "\u200B", value: "\u200B" },

				{
					name: "Saving Throw",
					value: !monsterInfo?.saving_throws ? "None" : monsterInfo.saving_throws,
				},
				{
					name: "Skills",
					value: !monsterInfo?.skills ? "None" : monsterInfo.skills,
				},
				{
					inline: true,
					name: "Damage Resistances ",
					value: !monsterInfo?.damage_resistances ? "None" : monsterInfo.damage_resistances,
				},
				{
					inline: true,
					name: "Damage Immunities",
					value: !monsterInfo?.damage_immunities ? "None" : monsterInfo.damage_immunities,
				},
				{
					inline: true,
					name: "Condition Immunities",
					value: !monsterInfo?.condition_immunities ? "None" : monsterInfo.condition_immunities,
				},
				{ name: "Senses", value: monsterInfo.senses },
				{ name: "Languages", value: monsterInfo.languages },
				{ name: "Challange", value: monsterInfo.challange },
				{ name: "\u200B", value: "\u200B" }
			)
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		const embed2 = new Discord.MessageEmbed()
			.setTitle("Actions")
			.setColor("#DC143C")
			.setDescription(monsterInfo.actions)
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		const embed3 = new Discord.MessageEmbed()
			.setTitle("Traits")
			.setColor("#DC143C")
			.setDescription(monsterInfo?.traits)
			.setFooter("Write .monsterlist or .monster")
			.setTimestamp(new Date());
      
      const embed4 = new Discord.MessageEmbed()
			.setTitle("Legendary Actions")
			.setColor("#DC143C")
			.setDescription(`${monsterInfo?.legendary_actions}`)
			.setFooter("Write .monsterlist or .monsters")
			.setTimestamp(new Date());

		await message.channel.send(embed);

		if (monsterInfo?.traits) {
			message.channel.send(embed3);
		}

		message.channel.send(embed2);
      
      if (monsterInfo?.legendary_actions) {
			message.channel.send(embed4);
		}
	},
};