const { DateTime } = require("luxon");
const Discord = require("discord.js");
const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const eventDB = require("../../utility/mongodbFramework");
const functions = require("../../utility/functions.js");

const { token } = require("../../jsonFiles/config.json");

bot.login(token);

module.exports = {
	name: "re-event",
	aliases: ["re-event", "r-e", "reevent"],
	description: "If the bot were to crash use this to make the embed work again.",
	args: true,
	minArgs: 1,
	cooldown: 1,
	guildOnly: true,
	usage: `
	<2000-01-01T12:00> 
	<in 4 hours 20 minutes>
	<in 3 hours>
	<in 45 minutes> 
	<today[or td] 15:45> 
	<tomorrow[or tm] 15:45>`,
	async execute(message, args) {
		const essentialInfo = await eventDB.getEssentialInfo(args[0]); //	timeIniated, timeFinish, originalSender, originalSenderUsername, embedOption,

		let scheduleInfo;
		const embedId = args[0];
		const embedOption = essentialInfo[4];

		message.channel
			.send({
				embeds: [functions.embedify(`Re-launched the event embed. Embed message id: ${embedId}.`)],
			})
			.then((message) => {
				setTimeout(() => message.delete(), 5 * 1000);
			});
		const dateThen = Number(essentialInfo[1]);
		const dateNow = DateTime.now().setZone("Europe/Stockholm").toMillis();

		if (dateNow > dateThen) return message.reply("Cannot schedule a game in the past...");

		const timer1 = dateThen - dateNow - 3600000;
		const timer2 = dateThen - dateNow;
		const displayTime = DateTime.fromMillis(dateThen).toLocaleString({
			month: "long",
			day: "numeric",
			weekday: "long",
			hour: "numeric",
			minute: "2-digit",
		});

		const msgSender = essentialInfo[3];
		const originalSender = essentialInfo[2];

		const {
			guild: { memberCount },
		} = message;

		function updateEmbed(option, users1, users2, users3, ...displayText) {
			const users1Length = users1.length;
			const users2Length = users2.length;
			const users3Length = users3.length;

			const updatedDndEmbed = new Discord.MessageEmbed()
				.setTitle(`**D&D** at ${displayTime}`)
				.setThumbnail("https://i.imgur.com/u0aN19t.png")
				.setDescription(displayText[0])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Campaign:", value: `${displayText[1]}`, inline: true },
					{ name: "DM:", value: `${displayText[2]}`, inline: true },
					{ name: "Whereabout:", value: `${displayText[3]}`, inline: true },
					{ name: "\u200B", value: "\u200B" },
					{
						name: `<:accepted:867150417271324672>Accepted (${users1Length}/${memberCount})`,
						value: users1Length !== 0 ? users1.join("\n") : "-",
						inline: true,
					},
					{
						name: `<:unsure:867150452423131166>Unsure (${users2Length}/${memberCount})`,
						value: users2Length !== 0 ? users2.join("\n") : "-",
						inline: true,
					},
					{
						name: `<:denied:867150431612436510>Denied (${users3Length}/${memberCount})`,
						value: users3Length !== 0 ? users3.join("\n") : "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			const updatedGameEventEmbed = new Discord.MessageEmbed()
				.setTitle(`**Game Event** at ${displayTime}`)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
				)
				.setDescription(displayText[0])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Game:", value: `${displayText[1]}`, inline: true },
					{ name: "Additional Notes:", value: `${displayText[2]}`, inline: true },
					{ name: "\u200B", value: "\u200B" },
					{
						name: `<:accepted:867150417271324672>Accepted (${users1Length}/${memberCount})`,
						value: users1Length !== 0 ? users1.join("\n") : "-",
						inline: true,
					},
					{
						name: `<:unsure:867150452423131166>Unsure (${users2Length}/${memberCount})`,
						value: users2Length !== 0 ? users2.join("\n") : "-",
						inline: true,
					},
					{
						name: `<:denied:867150431612436510>Denied (${users3Length}/${memberCount})`,
						value: users3Length !== 0 ? users3.join("\n") : "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			const updatedEventEmbed = new Discord.MessageEmbed()
				.setTitle(`**Event** at ${displayTime}`)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
				)
				.setDescription(displayText[0])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Event:", value: `${displayText[1]}`, inline: true },
					{ name: "Additional Notes:", value: `${displayText[2]}`, inline: true },
					{ name: "\u200B", value: "\u200B" },
					{
						name: `<:accepted:867150417271324672>Accepted (${users1Length}/${memberCount})`,
						value: users1Length !== 0 ? users1.join("\n") : "-",
						inline: true,
					},
					{
						name: `<:unsure:867150452423131166>Unsure (${users2Length}/${memberCount})`,
						value: users2Length !== 0 ? users2.join("\n") : "-",
						inline: true,
					},
					{
						name: `<:denied:867150431612436510>Denied (${users3Length}/${memberCount})`,
						value: users3Length !== 0 ? users3.join("\n") : "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			return option === 1
				? updatedDndEmbed
				: option === 2
				? updatedGameEventEmbed
				: updatedEventEmbed;
		}

		// Set a filter to ONLY grab those reactions & discard the reactions from the bot
		const filter = (reaction, user) => {
			return (
				["accepted", "denied", "unsure", "edit", "🗑️"].includes(reaction.emoji.name) && !user.bot
			);
		};

		// Create the collector

		message.channel.messages.fetch(`${embedId}`).then((message) => {
			const collector = message.createReactionCollector(filter, {
				time: timer2, //timer2
			});

			collector.on("collect", async (reaction, user) => {
				reaction.users.remove(user);

				const emoji = reaction._emoji.name;

				const emojiName =
					emoji === "accepted"
						? "accepted"
						: emoji === "denied"
						? "denied"
						: emoji === "unsure"
						? "tentative"
						: emoji === "edit"
						? "edit"
						: "delete";

				if (emojiName === "edit" && user.id === originalSender) {
					message.channel
						.send(
							functions.embedify(
								"Are you sure you want to delete this schedule? If not ignore this message,"
							)
						)
						.then((msg) => {});
				} else if (emojiName === "edit" && user.id !== originalSender) {
					return message.channel
						.send(functions.embedify("You cannot edit this embed!"))
						.then((msg) => {
							setTimeout(() => msg.delete(), 3 * 1000);
						});
				} else if (emojiName === "delete" && user.id === originalSender) {
					message.channel
						.send({
							embeds: [
								functions.embedify(
									"Are you sure you want to delete this schedule? If not ignore this message."
								),
							],
						})
						.then((msg) => {
							msg.react("✅");

							const filter1 = (reaction, user) => {
								return user.id === originalSender;
							};

							const collector1 = msg.createReactionCollector(filter1, { max: 1, time: 30000 });

							collector1.on("collect", (reaction, user) => {
								const emoji = reaction._emoji.name;

								if (emoji === "✅") {
									msg.edit({
										embeds: [functions.embedify("You've successfully deleted the schedule")],
									});
									eventDB.deleteSchedule(embedId);
									collector.stop();
									message.delete();
									setTimeout(() => msg.delete(), 3 * 1000);
								}
							});

							collector1.on("end", (collected, reason) => {
								if (reason === "time") {
									msg.edit(
										functions.embedify(
											"You ran out of time. React with the bin again to reinitiate this process"
										)
									);
									setTimeout(() => msg.delete(), 7.5 * 1000);
								}
							});
						});
				} else if (emojiName === "delete" && user.id !== originalSender) {
					return message.channel
						.send("You cannot delete this schedule!")
						.then((msg) => setTimeout(() => msg.delete(), 7.5 * 1000));
				} else {
					const {
						message: { id },
					} = reaction;

					const eventConfig = await eventDB.getDisplayText(embedId);

					scheduleInfo = await eventDB.changeSchedule(id, user.username, user.id, emojiName);

					message.edit({
						embeds: [
							updateEmbed(
								embedOption,
								scheduleInfo[0],
								scheduleInfo[1],
								scheduleInfo[2],
								eventConfig[0],
								eventConfig[1],
								eventConfig[2],
								eventConfig[3]
							),
						],
					});
				}
			});

			collector.on("end", (reason) => {
				message.reactions
					.removeAll()
					.catch((error) => console.error("Failed to clear reactions: ", error));
				message.edit(
					functions.embedify(
						`Hope you all enjoyed the ${
							embedOption === 1 ? "session!" : embedOption === 2 ? "game event!" : "event!"
						}`
					)
				);
				eventDB.deleteSchedule(embedId);

				message.delete({
					timeout: 43200000,
				});
			});

			if (timer1 - 100 >= 0) {
				setTimeout(async () => {
					await eventDB.validateSchedule(embedId);

					const userIds = await eventDB.getScheduleIds(embedId);

					if (!userIds.length === 0) return;

					userIds.forEach((id) => {
						bot.users.fetch(id).then((dm) => {
							dm.send(`Reminder for the event at ${displayTime}: ${config[config.length - 1]}`);
						});
					});
				}, timer1);
			}
		});
	},
};
