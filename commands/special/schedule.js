const { DateTime } = require("luxon");
const Discord = require("discord.js");
const bot = new Discord.Client();
const scheduleDB = require("../../utility/mongodbFramework");
const functions = require("../../utility/functions.js");

const { token } = require("../../jsonFiles/config.json");

bot.login(token);

module.exports = {
	name: "schedule",
	aliases: ["schedule", "s"],
	description: "",
	args: true,
	minArgs: 1,
	cooldown: 1,
	usage: "<2000-01-01T12:00>",
	execute(message, args) {
		let scheduleInfo;
		let embedId;
		let embedPref;
		const dateNow = DateTime.now().setZone("Europe/Stockholm").toMillis();
		const dateThen = DateTime.fromISO(args[0]).toMillis(); // 2021-06-18T14:30:00

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
		const displayTime2 = DateTime.fromMillis(dateThen - 3600000).toLocaleString({
			month: "long",
			day: "numeric",
			weekday: "long",
			hour: "numeric",
			minute: "2-digit",
		});

		const msgSender = message.author.username;
		const originalSender = message.author.id;

		let {
			guild: { memberCount },
		} = message;
		if (isNaN(timer1, timer2)) {
			message.delete({
				timeout: 10000,
			});
			return message
				.reply("That is not correctly formatted, example: `<2000-01-01T12:00>`")
				.then((message) => {
					message.delete({
						timeout: 10000,
					});
				});
		}
		message.reply("Check your DM'S").then((msg) =>
			msg.delete({
				timeout: 10000,
			})
		);

		let config = [];
		message.channel.bulkDelete(1);

		const getConfig = new Promise((resolve, reject) => {
			let i = 0;
			let originalChanel;
			message.author
				.send(functions.embedify("Choose preset. `<d&d>, <game event> or <event>`"))
				.then((m) => {
					originalChanel = message.channel.name;

					const collector = m.channel.createMessageCollector(
						(me) => me.author.id === message.author.id && me.channel === m.channel,
						{
							time: 300 * 1000,
						}
					);
					collector.on("collect", (collected) => {
						config.push(collected.content);
						const configQuestions =
							embedPref === 1
								? timer1 >= 0
									? [
											"What do you want the description to be?",
											"What campaign are you playing?",
											"Who is the DM?",
											"What is the whereabout of the session?",
											`What do you want the reminder message at "${displayTime2}" to be?`,
									  ]
									: [
											"What do you want the description to be?",
											"What campaign are you playing?",
											"Who is the DM?",
											"What is the whereabout of the session?",
									  ]
								: embedPref === 2
								? timer1 >= 0
									? [
											"What do you want the description to be?",
											"What game are you playing?",
											"Any additional notes?",
											`What do you want the reminder message at "${displayTime2}" to be?`,
									  ]
									: [
											"What do you want the description to be?",
											"What game are you playing?",
											"Any additional notes?",
									  ]
								: timer1 >= 0
								? [
										"What do you want the description to be?",
										"What are you doing?",
										"Any additional notes?",
										`What do you want the reminder message at "${displayTime2}" to be?`,
								  ]
								: [
										"What do you want the description to be?",
										"What are you doing?",
										"Any additional notes?",
								  ];
						userData = collected.channel;

						switch (config[0].toLowerCase()) {
							case "dnd":
							case "d&d":
							case "dungeons and dragons":
								if (i >= configQuestions.length) {
									resolve();
									collected.channel.send(
										functions.embedify(`**Sending message in:** \`${originalChanel}\`...`)
									);
									collector.stop();
									return;
								}

								embedPref = 1;
								collected.channel.send(functions.embedify(configQuestions[i]));
								break;
							case "game event":
								if (i >= configQuestions.length) {
									resolve();
									collected.channel.send(
										functions.embedify(`**Sending message in:** \`${originalChanel}\`...`)
									);
									collector.stop();
									return;
								}
								embedPref = 2;
								collected.channel.send(functions.embedify(configQuestions[i]));
								break;
							case "event":
								if (i >= configQuestions.length) {
									resolve();
									collected.channel.send(
										functions.embedify(`**Sending message in:** \`${originalChanel}\`...`)
									);
									collector.stop();
									return;
								}
								collected.channel.send(functions.embedify(configQuestions[i]));
								break;
							default:
								reject();
								collected.channel.send("Something went wrong, try again");
								collector.stop();
								break;
						}
						i += 1;
					});
					collector.on("end", (collected, reason) => {
						if (reason === "time")
							return (
								reject(),
								message.author.send(
									`You ran out of time. Write \`.schedule <time>\` to reinitiate this command. `
								)
							);

						return config;
					});
				});
		});

		// Sending the acutal embed

		function firstExecution() {
			const dndEmbed = new Discord.MessageEmbed()
				.setTitle(`**D&D** at ${displayTime}`)
				.setThumbnail("https://i.imgur.com/u0aN19t.png")
				.setDescription(config[1])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Campaign:", value: `${config[2]}`, inline: true },
					{ name: "DM:", value: `${config[3]}`, inline: true },
					{ name: "Whereabout:", value: `${config[4]}`, inline: true }, // .schedule [2021-01-01T12:00:00] [description] [campaign] [DM] [whereabout]
					{ name: "\u200B", value: "\u200B" },
					{
						name: `Accepted (0/${memberCount})`,
						value: "-",
						inline: true,
					},

					{
						name: `Unsure (0/${memberCount})`,
						value: "-",
						inline: true,
					},
					{
						name: `Denied (0/${memberCount})`,
						value: "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			const gameEventEmbed = new Discord.MessageEmbed()
				.setTitle(`**Game Event** at ${displayTime}`)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
				)
				.setDescription(config[1])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Game:", value: `${config[2]}`, inline: true },
					{ name: "Additional Notes:", value: `${config[3]}`, inline: true },
					{ name: "\u200B", value: "\u200B" },
					{
						name: `Accepted (0/${memberCount})`,
						value: "-",
						inline: true,
					},

					{
						name: `Unsure (0/${memberCount})`,
						value: "-",
						inline: true,
					},
					{
						name: `Denied (0/${memberCount})`,
						value: "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			const eventEmbed = new Discord.MessageEmbed()
				.setTitle(`**Event** at ${displayTime}`)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
				)
				.setDescription(config[1])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Event:", value: `${config[2]}`, inline: true },
					{ name: "Additional Notes:", value: `${config[3]}`, inline: true },
					{ name: "\u200B", value: "\u200B" },
					{
						name: `Accepted (0/${memberCount})`,
						value: "-",
						inline: true,
					},

					{
						name: `Unsure (0/${memberCount})`,
						value: "-",
						inline: true,
					},
					{
						name: `Denied (0/${memberCount})`,
						value: "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			message.channel
				.send(
					"@everyone",
					embedPref === 1 ? dndEmbed : embedPref === 2 ? gameEventEmbed : eventEmbed
				)
				.then(async (message) => {
					message.react("✅");
					message.react("❔");
					message.react("❌");
					message.react("🗑️");

					embedId = message.id;

					scheduleDB.iniateSchedule(embedId);

					// Set a filter to ONLY grab those reactions & discard the reactions from the bot
					const filter = (reaction, user) => {
						return ["✅", "❌", "❔", "🗑️"].includes(reaction.emoji.name) && !user.bot;
					};

					// Create the collector
					const collector = message.createReactionCollector(filter, {
						time: timer2, //timer2
					});

					collector.on("collect", async (reaction, user) => {
						reaction.users.remove(user);

						const emoji = reaction._emoji.name;

						const emojiName =
							emoji === "✅"
								? "accepted"
								: emoji === "❌"
								? "denied"
								: emoji === "❔"
								? "tentative"
								: "delete";

						if (emojiName === "delete" && user.id === originalSender) {
							message.channel
								.send("Are you sure you want to delete this schedule? If not ignore this message,")
								.then((msg) => {
									msg.react("✅");

									const filter1 = (reaction, user) => {
										return user.id === originalSender;
									};

									const collector1 = msg.createReactionCollector(filter1, { max: 1, time: 30000 });

									collector1.on("collect", (reaction, user) => {
										const emoji = reaction._emoji.name;

										if (emoji === "✅") {
											msg.edit("You've successfully deleted the schedule");
											scheduleDB.deleteSchedule(embedId);
											collector.stop();
											message.delete();
											msg.delete({
												timeout: 3000,
											});
										}
									});

									collector1.on("end", (collected, reason) => {
										if (reason === "time") {
											msg.edit(
												"You ran out of time. React with the bin again to reinitiate this process"
											);
											msg.delete({
												timeout: 7500,
											});
										}
									});
								});
						} else if (emojiName === "delete" && user.id !== originalSender) {
							return message.channel.send("You cannot delete this schedule!").then((msg) =>
								msg.delete({
									timeout: 5000,
								})
							);
						}
						const {
							message: { id },
						} = reaction;
						scheduleInfo = await scheduleDB.changeSchedule(id, user.username, user.id, emojiName);

						const upatedDndEmbed = new Discord.MessageEmbed()
							.setTitle(`**D&D** at ${displayTime}`)
							.setThumbnail("https://i.imgur.com/u0aN19t.png")
							.setDescription(config[1])
							.setColor("DC143C")
							.addFields(
								{ name: "\u200B", value: "\u200B" },
								{ name: "Campaign:", value: `${config[2]}`, inline: true },
								{ name: "DM:", value: `${config[3]}`, inline: true },
								{ name: "Whereabout:", value: `${config[4]}`, inline: true }, // .schedule [2021-01-01T12:00:00] [description] [campaign] [DM] [whereabout]
								{ name: "\u200B", value: "\u200B" },
								{
									name: `Accepted (${scheduleInfo[0].length}/${memberCount})`,
									value: scheduleInfo[0].length !== 0 ? scheduleInfo[0] : "-",
									inline: true,
								},
								{
									name: `Unsure (${scheduleInfo[2].length}/${memberCount})`,
									value: scheduleInfo[2].length !== 0 ? scheduleInfo[2] : "-",
									inline: true,
								},
								{
									name: `Denied (${scheduleInfo[1].length}/${memberCount})`,
									value: scheduleInfo[1].length !== 0 ? scheduleInfo[1] : "-",
									inline: true,
								}
							)
							.setFooter(`This message was issued by ${msgSender}`)
							.setTimestamp(new Date());

						const upatedGameEventEmbed = new Discord.MessageEmbed()
							.setTitle(`**Game Event** at ${displayTime}`)
							.setThumbnail(
								"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
							)
							.setDescription(config[1])
							.setColor("DC143C")
							.addFields(
								{ name: "\u200B", value: "\u200B" },
								{ name: "Game:", value: `${config[2]}`, inline: true },
								{ name: "Additional Notes:", value: `${config[3]}`, inline: true },
								{ name: "\u200B", value: "\u200B" },
								{
									name: `Accepted (${scheduleInfo[0].length}/${memberCount})`,
									value: scheduleInfo[0].length !== 0 ? scheduleInfo[0] : "-",
									inline: true,
								},
								{
									name: `Unsure (${scheduleInfo[2].length}/${memberCount})`,
									value: scheduleInfo[2].length !== 0 ? scheduleInfo[2] : "-",
									inline: true,
								},
								{
									name: `Denied (${scheduleInfo[1].length}/${memberCount})`,
									value: scheduleInfo[1].length !== 0 ? scheduleInfo[1] : "-",
									inline: true,
								}
							)
							.setFooter(`This message was issued by ${msgSender}`)
							.setTimestamp(new Date());

						const upatedEventEmbed = new Discord.MessageEmbed()
							.setTitle(`**Event** at ${displayTime}`)
							.setThumbnail(
								"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
							)
							.setDescription(config[1])
							.setColor("DC143C")
							.addFields(
								{ name: "\u200B", value: "\u200B" },
								{ name: "Event:", value: `${config[2]}`, inline: true },
								{ name: "Additional Notes:", value: `${config[3]}`, inline: true },
								{ name: "\u200B", value: "\u200B" },
								{
									name: `Accepted (${scheduleInfo[0].length}/${memberCount})`,
									value: scheduleInfo[0].length !== 0 ? scheduleInfo[0] : "-",
									inline: true,
								},
								{
									name: `Unsure (${scheduleInfo[2].length}/${memberCount})`,
									value: scheduleInfo[2].length !== 0 ? scheduleInfo[2] : "-",
									inline: true,
								},
								{
									name: `Denied (${scheduleInfo[1].length}/${memberCount})`,
									value: scheduleInfo[1].length !== 0 ? scheduleInfo[1] : "-",
									inline: true,
								}
							)
							.setFooter(`This message was issued by ${msgSender}`)
							.setTimestamp(new Date());

						message.edit(
							"@everyone",
							embedPref === 1
								? upatedDndEmbed
								: embedPref === 2
								? upatedGameEventEmbed
								: upatedEventEmbed
						);
					});

					collector.on("end", (reason) => {
						message.reactions
							.removeAll()
							.catch((error) => console.error("Failed to clear reactions: ", error));
						message.edit(
							functions.embedify(
								`Hope you all enjoyed the ${
									embedPref === 1 ? "session!" : embedPref === 2 ? "game event!" : "event!"
								}`
							)
						);
						scheduleDB.deleteSchedule(embedId);

						message.delete({
							timeout: 43200000,
						});
					});

					if (timer1 >= 0) {
						setTimeout(async () => {
							const userIds = await scheduleDB.getScheduleIds(embedId);

							if (!userIds.length === 0) return;

							userIds.forEach((id) => {
								bot.users.fetch(id).then((dm) => {
									dm.send(`Reminder for the event at ${displayTime}: ${config[5]}`);
								});
							});
						}, timer1);
					}
				});
		}

		function handleRejected() {
			return;
		}

		getConfig.then(firstExecution, handleRejected);
	},
};
