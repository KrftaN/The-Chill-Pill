const { MessageEmbed } = require("discord.js");
const cheerio = require("cheerio");
const axios = require("axios");
const { DateTime, Settings } = require("luxon");

module.exports = {
	name: "map",
	aliases: [],
	description: "checks the users balance",
	cooldown: 0,
	usage: "",
	async execute(message, args) {
		const url = args.shift() || "https://webdiplomacy.net/board.php?gameID=412557";
		Settings.defaultZone = "Europe/Stockholm";
		await axios(url).then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);

			const currentMap = `https://webdiplomacy.net/${$("#LargeMapLink.mapnav", html).attr("href")}`;
			const currentDateCheck = $(".gameDate", html).text();
			const currentDateMillis = DateTime.now().setZone("America/New_York").toMillis();
			const timeLeft = $(".timeremaining", html).text();

			if (!timeLeft) return sendEmbed();

			const timeArray = timeLeft.split(",");
			const timeLeftDate = DateTime.fromMillis(currentDateMillis)
				.plus({ hours: removeLetters(timeArray[0]), minutes: removeLetters(timeArray[1]) })
				.toMillis();
			function removeLetters(str) {
				return str.replace(/\D/g, "");
			}

			const displayTime = DateTime.fromMillis(timeLeftDate).toLocaleString(
				{
					day: "numeric",
					weekday: "long",
					hour: "numeric",
					minute: "2-digit",
				},
				{ setZone: true }
			);

			sendEmbed(timeLeft, displayTime);

			function sendEmbed(timeLeft, displayTime) {
				if (!timeLeft) {
					timeLeft = "The Game is Finished!";
					displayTime = "- ";
				}

				const embed = new MessageEmbed()
					.setTitle(`${currentDateCheck} | Current Diplomacy Map`)
					.setImage(currentMap.toString())
					.setURL(url.toString())
					.addFields({
						name: "Time Remaining:",
						value: `${timeLeft} (${displayTime})`,
						inline: true,
					})
					.setColor("#FF0000")
					.setTimestamp(new Date());

				message.reply({ embeds: [embed] });
			}
		});
	},
};
