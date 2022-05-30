const { DateTime, Settings } = require("luxon");
const { MessageEmbed } = require("discord.js");
const { embedify } = require("../../utility/functions/embedify");

const { changeSchedule } = require("../../utility/database-functions/event/changeSchedule");
const { deleteSchedule } = require("../../utility/database-functions/event/deleteSchedule");
const { getDisplayText } = require("../../utility/database-functions/event/getDisplayText");
const { getScheduleIds } = require("../../utility/database-functions/event/getScheduleIds");
const { iniateSchedule } = require("../../utility/database-functions/event/iniateSchedule");
const { validateSchedule } = require("../../utility/database-functions/event/validateSchedule");

module.exports = {
	name: "event",
	aliases: ["schedule", "e"],
	description: "This is where you can schedule events ect.",
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
	execute(message, args, bot) {
		let scheduleInfo;
		let embedId;
		let embedOption;
		let dateThen;

		Settings.defaultZone = "Europe/Stockholm";
		const dateNow = DateTime.now().setZone("Europe/Stockholm").toMillis();

		const argsLower = args.map(function (arg) {
			return arg.toLowerCase();
		});

		try {
			if (argsLower.includes("in")) {
				const fix1 = argsLower.includes("hour")
					? "hour"
					: argsLower.includes("hours")
					? "hours"
					: false;
				const fix2 = argsLower.includes("minute")
					? "minute"
					: argsLower.includes("minutes")
					? "minutes"
					: false;

				const hours = fix1 === false ? 0 : argsLower[argsLower.indexOf(fix1) - 1];
				const minutes = fix2 === false ? 0 : argsLower[argsLower.indexOf(fix2) - 1];

				if (hours === 0 && minutes === 0) {
					console.log("This is wrong!");
					throw "Error!";
				}

				dateThen = DateTime.fromMillis(dateNow).plus({ hours, minutes }).toMillis();
			} else if (argsLower.includes("today") || argsLower.includes("td")) {
				const isoFormat = DateTime.fromMillis(dateNow).toISO();

				dateThen = DateTime.fromISO(`${isoFormat.slice(0, 10)}T${args[1]}`).toMillis();
			} else if (argsLower.includes("tm") || argsLower.includes("tomorrow")) {
				const isoFormat = DateTime.fromMillis(dateNow).toISO();

				dateThen = DateTime.fromISO(`${isoFormat.slice(0, 10)}T${args[1]}`)
					.plus({ days: 1 })
					.toMillis();
			} else {
				dateThen = DateTime.fromISO(args[0]).toMillis();
			}
		} catch (e) {
			console.log(e);

			message.delete();
			return message
				.reply({
					content: `
					That is not correctly formatted, examples: 
					\`<2000-01-01T12:00>\` 
					\`<in 4 hours 20 minutes>\`
					\`<in 3 hours>\`
					\`<in 45 minutes>\` 
					\`<today[or td] 15:45>\` 
					\`<tomorrow[or tm] 15:45>\` 
					current date in ISO format: \`${DateTime.fromMillis(dateNow).toISO().slice(0, 16)}\``,
				})
				.then((message) => {
					setTimeout(() => message.delete(), 25 * 1000);
				});
		}

		if (dateNow > dateThen)
			return message.reply({ content: "Cannot schedule a game in the past..." });

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

		const msgSender = message.author.tag;
		const originalSender = message.author.id;

		let {
			guild: { memberCount },
		} = message;
		if (isNaN(timer1, timer2)) {
			setTimeout(() => message.delete(), 20 * 1000);
			return message
				.reply({
					content: `
					That is not correctly formatted, examples: 
					\`<2000-01-01T12:00>\` 
					\`<in 4 hours 20 minutes>\`
					\`<in 3 hours>\`
					\`<in 45 minutes>\` 
					\`<today[or td] 15:45>\` 
					\`<tomorrow[or tm] 15:45>\` 
					current date in ISO format: \`${DateTime.fromMillis(dateNow).toISO().slice(0, 16)}\``,
				})
				.then((message) => {
					setTimeout(() => message.delete(), 25 * 1000);
				});
		}
		message.delete();
		message.reply({ content: "Check your DM'S" }).then((msg) => {
			setTimeout(() => msg.delete(), 10 * 1000);
		});

		function updateEmbed(option, users1, users2, users3, ...displayText) {
			const users1Length = users1.length;
			const users2Length = users2.length;
			const users3Length = users3.length;

			const updatedDndEmbed = new MessageEmbed()
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

			const updatedGameEventEmbed = new MessageEmbed()
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

			const updatedEventEmbed = new MessageEmbed()
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

		let config = new Array();
		const getConfig = new Promise((resolve, reject) => {
			let i = 1;
			let originalChanel;
			message.author
				.send({ embeds: [embedify("Choose preset. `<d&d>, <game event> or <event>`")] })
				.then(async (m) => {
					originalChanel = message.channel.name;
					m.react("1️⃣");
					m.react("2️⃣");
					m.react("3️⃣");

					const reactionFilter = (reaction, user) => {
						return ["1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name) && !user.bot;
					};

					// Create the collector
					const reactionCollector = m.createReactionCollector({
						filter: reactionFilter,
						time: 60 * 1000, //timer2
					});

					await reactionCollector.on("collect", async (reaction) => {
						switch (reaction._emoji.name) {
							case "1️⃣":
								embedOption = 1;
								reactionCollector.stop();

								break;
							case "2️⃣":
								embedOption = 2;
								reactionCollector.stop();

								break;
							case "3️⃣":
								embedOption = 3;
								reactionCollector.stop();

								break;
						}
					});

					reactionCollector.on("end", (collected, reason) => {
						if (reason === "time") {
							reject();
							return m.channel.send(
								`You ran out of time. Write \`.schedule <time>\` to reinitiate this command. `
							);
						}

						m.edit({
							embeds: [
								embedify(
									`chose \`${
										embedOption === 1 ? "D&D" : embedOption === 2 ? "Game Event" : "Event"
									}\``
								),
							],
						});
						m.channel.send({
							embeds: [embedify(`What do you want the description to be?`)],
						});

						messageCollecting();
					});

					function messageCollecting() {
						const messageCollector = m.channel.createMessageCollector({
							filter: (me) => me.author.id === message.author.id && me.channel === m.channel,
							time: 300 * 1000,
						});
						messageCollector.on("collect", (collected) => {
							const configQuestions =
								embedOption === 1
									? timer1 - 100 >= 0
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
									: embedOption === 2
									? timer1 - 100 >= 0
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
									: timer1 - 100 >= 0
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
							config.push(collected.content);
							if (i >= configQuestions.length) {
								resolve();
								collected.channel.send({
									embeds: [embedify(`**Sending message in:** \`${originalChanel}\`...`)],
								});
								messageCollector.stop();
								return;
							}

							m.channel.send({ embeds: [embedify(configQuestions[i])] });

							i += 1;
						});
						messageCollector.on("end", (collected, reason) => {
							if (reason === "time")
								return (
									reject(),
									message.author.send(
										`You ran out of time. Write \`.schedule <time>\` to reinitiate this command. `
									)
								);

							return config;
						});
					}
				});
		});

		// Sending the acutal embed

		function firstExecution() {
			const dndEmbed = new MessageEmbed()
				.setTitle(`**D&D** at ${displayTime}`)
				.setThumbnail("https://i.imgur.com/u0aN19t.png")
				.setDescription(config[0])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Campaign:", value: `${config[1]}`, inline: true },
					{ name: "DM:", value: `${config[2]}`, inline: true },
					{ name: "Whereabout:", value: `${config[3]}`, inline: true }, // .schedule [2021-01-01T12:00:00] [description] [campaign] [DM] [whereabout]
					{ name: "\u200B", value: "\u200B" },
					{
						name: `<:accepted:867150417271324672>Accepted (0/${memberCount})`,
						value: "-",
						inline: true,
					},

					{
						name: `<:unsure:867150452423131166>Unsure (0/${memberCount})`,
						value: "-",
						inline: true,
					},
					{
						name: `<:denied:867150431612436510>Denied (0/${memberCount})`,
						value: "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			const gameEventEmbed = new MessageEmbed()
				.setTitle(`**Game Event** at ${displayTime}`)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
				)
				.setDescription(config[0])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Game:", value: `${config[1]}`, inline: true },
					{ name: "Additional Notes:", value: `${config[2]}`, inline: true },
					{ name: "\u200B", value: "\u200B" },
					{
						name: `<:accepted:867150417271324672>Accepted (0/${memberCount})`,
						value: "-",
						inline: true,
					},

					{
						name: `<:unsure:867150452423131166>Unsure (0/${memberCount})`,
						value: "-",
						inline: true,
					},
					{
						name: `<:denied:867150431612436510>Denied (0/${memberCount})`,
						value: "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			const eventEmbed = new MessageEmbed()
				.setTitle(`**Event** at ${displayTime}`)
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/836600699080671262/855459529763323914/The_Chill_Pill.png"
				)
				.setDescription(config[0])
				.setColor("DC143C")
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					{ name: "Event:", value: `${config[1]}`, inline: true },
					{ name: "Additional Notes:", value: `${config[2]}`, inline: true },
					{ name: "\u200B", value: "\u200B" },
					{
						name: `<:accepted:867150417271324672>Accepted (0/${memberCount})`,
						value: "-",
						inline: true,
					},

					{
						name: `<:unsure:867150452423131166>Unsure (0/${memberCount})`,
						value: "-",
						inline: true,
					},
					{
						name: `<:denied:867150431612436510>Denied (0/${memberCount})`,
						value: "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());

			message.channel
				.send({
					content: "@everyone",
					embeds: [embedOption === 1 ? dndEmbed : embedOption === 2 ? gameEventEmbed : eventEmbed],
				})
				.then(async (message) => {
					message.react("<:accepted:867150417271324672>");
					message.react("<:unsure:867150452423131166>");
					message.react("<:denied:867150431612436510>");
					message.react("<:edit:868949197456551966>");
					message.react("🗑️");

					embedId = message.id;

					if (embedOption !== 1) {
						await iniateSchedule(
							embedId,
							dateNow,
							dateThen,
							originalSender,
							msgSender,
							embedOption,
							config[0],
							config[1],
							config[2]
						);
					} else {
						await iniateSchedule(
							embedId,
							dateNow,
							dateThen,
							originalSender,
							msgSender,
							embedOption,
							config[0],
							config[1],
							config[2],
							config[3]
						);
					}

					// Set a filter to ONLY grab those reactions & discard the reactions from the bot
					const filter = (reaction, user) => {
						return (
							["accepted", "denied", "unsure", "edit", "🗑️"].includes(reaction.emoji.name) &&
							!user.bot
						);
					};

					// Create the collector
					const collector = message.createReactionCollector({
						filter,
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
								.send({
									embeds: [
										embedify(
											"Are you sure you want to delete this schedule? If not ignore this message,"
										),
									],
								})
								.then((msg) => {});
						} else if (emojiName === "edit" && user.id !== originalSender) {
							return message.channel
								.send({
									embeds: [embedify("You cannot edit this embed!")],
								})
								.then((msg) => {
									setTimeout(() => msg.delete(), 3 * 1000);
								});
						} else if (emojiName === "delete" && user.id === originalSender) {
							message.channel
								.send({
									embeds: [
										embedify(
											"Are you sure you want to delete this schedule? If not ignore this message."
										),
									],
								})
								.then((msg) => {
									msg.react("✅");

									const filter1 = (reaction, user) => {
										return user.id === originalSender;
									};

									const collector1 = msg.createReactionCollector({
										filter: filter1,
										max: 1,
										time: 30000,
									});

									collector1.on("collect", (reaction, user) => {
										const emoji = reaction._emoji.name;

										if (emoji === "✅") {
											msg.edit({
												embeds: [embedify("You've successfully deleted the schedule")],
											});
											deleteSchedule(embedId);
											collector.stop();
											message.delete();
											setTimeout(() => msg.delete(), 3 * 1000);
										}
									});

									collector1.on("end", (collected, reason) => {
										if (reason === "time") {
											msg.edit(
												embedify({
													embeds: [
														"You ran out of time. React with the bin again to reinitiate this process",
													],
												})
											);
											setTimeout(() => msg.delete(), 7.5 * 1000);
										}
									});
								});
						} else if (emojiName === "delete" && user.id !== originalSender) {
							return message.channel.send("You cannot delete this schedule!").then((msg) => {
								setTimeout(() => msg.delete(), 7.5 * 1000);
							});
						} else {
							const {
								message: { id },
							} = reaction;

							const eventConfig = await getDisplayText(embedId);

							scheduleInfo = await changeSchedule(id, user.username, user.id, emojiName);

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

						if (reason === "time") {
							message.edit({
								embeds: [
									embedify(
										`Hope you all enjoyed the ${
											embedOption === 1 ? "session!" : embedOption === 2 ? "game event!" : "event!"
										}`
									),
								],
							});
						}

						deleteSchedule(embedId);

						setTimeout(() => message.delete(), 43200000);
					});

					if (timer1 - 100 >= 0) {
						setTimeout(async () => {
							await validateSchedule(embedId);

							const userIds = await getScheduleIds(embedId);

							if (!userIds.length === 0) return;

							userIds.forEach((id) => {
								bot.users.fetch(id).then((dm) => {
									dm.send(`Reminder for the event at ${displayTime}: ${config[config.length - 1]}`);
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
