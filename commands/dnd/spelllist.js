const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });

const spells = require("../../jsonFiles/spells.json");

module.exports = {
	name: "spelllist",
	aliases: ["spells"],
	description: "This is a description",
	args: false,
	cooldown: 1,
	async execute(message, args, ) {
		message.delete();

		const list = {
			a: [],
			b: [],
			c: [],
			d: [],
			e: [],
			f: [],
			g: [],
			h: [],
			i: [],
			j: [],
			k: [],
			l: [],
			m: [],
			n: [],
			o: [],
			p: [],
			q: [],
			r: [],
			s: [],
			t: [],
			u: [],
			v: [],
			w: [],
			x: [],
			y: [],
			z: [],
		};

		spells.forEach((spell) => {
			const firstLetter = spell.name.charAt(0).toLowerCase();

			list[firstLetter].push(spell.name);
		});

		const embed = new Discord.MessageEmbed()
			.setTitle("All Available spells")
			.setTimestamp(new Date())
			.setColor("#DC143C");

		for (let i = 0; i < 26; i++) {
			if (Object.values(list)[i].length > 0) {
				embed.addField(
					Object.keys(list)[i].toUpperCase().toString(),
					Object.values(list)[i].join("\n")
				);
			} else {
				embed.addField(Object.keys(list)[i].toUpperCase().toString(), "-");
			}
		}

		message.author.send({ embeds: [embed] });
	},
};
