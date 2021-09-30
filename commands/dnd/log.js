const Discord = ({ Client, Intents } = require("discord.js"));
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });

const request = require("request");
const cheerio = require("cheerio");

module.exports = {
	name: "log",
	aliases: ["logmonster", "log"],
	description: "This is a description",
	creator: true,
	args: false,
	maxArgs: 1,
	cooldown: 1,
	async execute(message, args) {
		request(
			"https://jsigvard.com/dnd/monster.php?m=Adult%20Black%20Dragon",
			(error, response, html) => {
				if (!error && response.statusCode === 200) {
					const $ = cheerio.load(html);
					const h2 = $(".h2");

					console.log(h2);
				}
			}
		);
	},
};
