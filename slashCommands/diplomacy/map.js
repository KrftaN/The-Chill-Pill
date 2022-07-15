const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const cheerio = require("cheerio");
const axios = require("axios");
const { DateTime, Settings } = require("luxon");

module.exports = {
	name: "map",
	alias: [],
	data: new SlashCommandBuilder()
		.setName("map")
		.setDescription("Sends the current map of a webdiplomacy game.")
		.addStringOption((option) => {
			return (option = option
				.setName("gameurl")
				.setDescription("Past the link of the webDiplomacy.net game want the map of.")
				.setRequired(true));
		}),
	async execute(interaction) {
		const url = interaction.options.getString("gameurl");
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

				interaction.reply({ embeds: [embed] });
			}
		});
	},
};
