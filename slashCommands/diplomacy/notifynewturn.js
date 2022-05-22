const { SlashCommandBuilder } = require("@discordjs/builders");
const cheerio = require("cheerio");
const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
	name: "notifynewturn",
	alias: ["nnt"],
	data: new SlashCommandBuilder()
		.setName("notifynewturn")
		.setDescription("Ping a certain role when a new turn has begun")
		.addRoleOption((option) => {
			return (option = option
				.setName("role")
				.setDescription(
					"Select the role which will be notified. If you leave this empty it was defult to @everone."
				)
				.setRequired(false));
		})
		.addStringOption((option) => {
			return (option = option
				.setName("gameurl")
				.setDescription("Past the link of the webDiplomacy.net game you want to look after. ")
				.setRequired(false));
		}),
	async execute(interaction) {
		try {
			const url =
				interaction.options.getString("gameurl") ||
				"https://webdiplomacy.net/board.php?gameID=412557";
			const role = interaction.options.getRole("role") || "@everyone";

			let lastDate;
			let currentDateCheck;

			interaction.reply({
				content: `I will notify ${role} once a new round starts in ${url}`,
				ephemeral: true,
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

						const embed = new Discord.MessageEmbed()
							.setTitle(`${currentDate.toString()} | New Round Lads!`)
							.setImage(currentMap.toString())
							.setDescription("A new round has started, make sure to finish your moves!")
							.setURL(url.toString())
							.setColor("#FF0000")
							.setTimestamp(new Date());

						interaction.channel.send({ embeds: [embed] });

						interaction.channel.send(role).then((message) => {
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
