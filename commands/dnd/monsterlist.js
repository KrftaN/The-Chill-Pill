const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });

const monsters = require("../../jsonFiles/monsters.json");

module.exports = {
	name: "monsterlist",
	aliases: ["monsters"],
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

		monsters.forEach((monster) => {
			const firstLetter = monster.name.charAt(0).toLowerCase();

			list[firstLetter].push(monster.name);
		});

		const embed = new Discord.MessageEmbed()
			.setTitle("All Available Monsters")
			.setTimestamp(new Date())
			.setColor("#DC143C");

		for (let i = 0; i < 26; i++) {
			embed.addField(
				Object.keys(list)[i].toUpperCase().toString(),
				Object.values(list)[i].join("\n")
			);
		}

		message.author.send({ embeds: [embed] });
	},
};
