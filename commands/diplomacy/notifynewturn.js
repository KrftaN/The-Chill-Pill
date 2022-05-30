const cheerio = require("cheerio");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "notifynewturn",
	aliases: ["nnt"],
	description: "This is where you can schedule events ect.",
	guildOnly: true,
	async execute(message, args, bot) {
		try {
			const url = args.shift() || "https://webdiplomacy.net/board.php?gameID=412557";
			let lastDate;
			let currentDateCheck;

			message.delete();

			message.reply({ content: "I will notify everyone once a new round starts" }).then((m) => {
				setTimeout(() => m.delete(), 10 * 1000);
			});

			setInterval(async () => {
				await axios(url).then(async (response) => {
					const html = response.data;
					const $ = cheerio.load(html);

					currentDateCheck = $(".gameDate", html).text();

					lastDate = lastDate ?? currentDateCheck;

					console.log(currentDateCheck === lastDate);

					if (currentDateCheck === lastDate) return;
					lastDate = currentDateCheck;

					await axios(url).then((response) => {
						const html = response.data;
						const $ = cheerio.load(html);

						const currentDate = $(".gameDate", html).text();
						const currentMap = `https://webdiplomacy.net/${$("#LargeMapLink.mapnav", html).attr(
							"href"
						)}`;

						const embed = new MessageEmbed()
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
			}, 2000); //120000
		} catch (err) {
			console.log(err);
		}
	},
};
