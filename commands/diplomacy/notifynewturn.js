const cheerio = require("cheerio");
const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
	name: "notifynewturn",
	aliases: ["nnt"],
	description: "This is where you can schedule events ect.",
	guildOnly: true,
	async execute(message, args, guild, bot, folders) {
		try {
			const url = args.shift() || "https://webdiplomacy.net/board.php?gameID=412557";
			let lastDate;
			let currentDateCheck;

			setInterval(async () => {
				await axios(url).then((response) => {
					const html = response.data;
					const $ = cheerio.load(html);

					currentDateCheck = $(".gameDate", html).text();

					lastDate = lastDate ?? currentDateCheck;

					if (currentDateCheck === lastDate) return;
					lastDate = currentDateCheck;

					await axios(url).then((response) => {
						const html = response.data;
						const $ = cheerio.load(html);
		
						const currentDate = $(".gameDate", html).text();
						const currentMap = `https://webdiplomacy.net/${$("#LargeMapLink.mapnav", html).attr(
							"href"
						)}`;
		
						const embed = new Discord.MessageEmbed()
							.setTitle(`${currentDate.toString()} | New Round Lads!`)
							.setImage(currentMap.toString())
							.setDescription("A new round has started, make sure to finish your moves!")
							.setURL(url.toString())
							.setColor("#FF0000")
							.setTimestamp(new Date());
		
						message.channel.send({ embeds: [embed] });
		
						message.channel.send("@everyone").then((message) => {
							message.delete();
						});
					});
				});
			}, 120000);


		} catch (err) {
			console.log(err);
		}
	},
};
