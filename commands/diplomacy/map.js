const Discord = require("discord.js");
const cheerio = require("cheerio");
const axios = require("axios");

module.exports = {
	name: "map",
	aliases: [],
	description: "checks the users balance",
	cooldown: 0,
	usage: "",
	async execute(message, args, guild) {
		const url = args.shift() || "https://webdiplomacy.net/board.php?gameID=412557";

		await axios(url).then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);

			const timeLeft = $(".timeremaining", html).text();
			const currentMap = `https://webdiplomacy.net/${$("#LargeMapLink.mapnav", html).attr("href")}`;

			console.log(timeLeft);

			const embed = new Discord.MessageEmbed()
				.setTitle(`Current Diplomacy Map | ${timeLeft} remaining.`)
				.setImage(currentMap.toString())
				.setURL(url.toString())
				.setColor("#FF0000")
				.setTimestamp(new Date());

			message.reply({ embeds: [embed] });
		});
	},
};
