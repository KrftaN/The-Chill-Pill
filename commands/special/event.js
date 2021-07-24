const { DateTime } = require("luxon");
const Discord = require("discord.js");
const bot = new Discord.Client();
const scheduleDB = require("../../utility/mongodbFramework");
const functions = require("../../utility/functions.js");

const { token } = require("../../jsonFiles/config.json");

bot.login(token);

module.exports = {
	name: "event",
	aliases: ["event", "schedule", "e"],
	description: "This is where you can schedule events ect.",
	args: true,
	minArgs: 1,
	cooldown: 1,
	guildOnly: true,
	usage: "<2000-01-01T12:00>",
	usage: `<2000-01-01T12:00> 
	<in 4 hours 20 minutes>
	<in 3 hours>
	<in 45 minutes> 
	<today[or td] 15:45> 
	<tomorrow[or tm] 15:45>`,
	execute(message, args) {
		let scheduleInfo;
		let embedId;
		let embedPref;

		let dateThen;
		const dateNow = DateTime.now().setZone("Europe/Stockholm").toMillis();

		const argsLower = args.map(function (arg) {
			return arg.toLowerCase();
		});

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
				timeout: 20 * 1000,
			});
			return message
				.reply(
					`
					That is not correctly formatted, examples: 
					\`<2000-01-01T12:00>\` 
					\`<in 4 hours 20 minutes>\`
					\`<in 3 hours>\`
					\`<in 45 minutes>\` 
					\`<today[or td] 15:45>\` 
					\`<tomorrow[or tm] 15:45>\` 
					current date in ISO format: \`${DateTime.fromMillis(dateNow).toISO().slice(0, 16)}\``
				)
				.then((message) => {
					message.delete({
						timeout: 20 * 1000,
					});
				});
		}
		message.reply("Check your DM'S").then((msg) =>
			msg.delete({
				timeout: 10000,
			})
		);

		let config = new Array();
		message.channel.bulkDelete(1);

		const getConfig = new Promise((resolve, reject) => {
			let i = 1;
			let originalChanel;
			message.author
				.send(functions.embedify("Choose preset. `<d&d>, <game event> or <event>`"))
				.then(async (m) => {
					originalChanel = message.channel.name;
					m.react("1️⃣");
					m.react("2️⃣");
					m.react("3️⃣");

					const reactionFilter = (reaction, user) => {
						return ["1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name) && !user.bot;
					};

					// Create the collector
					const reactionCollector = m.createReactionCollector(reactionFilter, {
						time: 60 * 1000, //timer2
					});

					await reactionCollector.on("collect", async (reaction) => {
						switch (reaction._emoji.name) {
							case "1️⃣":
								embedPref = 1;
								reactionCollector.stop();

								break;
							case "2️⃣":
								embedPref = 2;
								reactionCollector.stop();

								break;
							case "3️⃣":
								embedPref = 3;
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
						m.edit(
							functions.embedify(
								`chose \`${embedPref === 1 ? "D&D" : embedPref === 2 ? "Game Event" : "Event"}\``
							)
						);
						m.channel.send(functions.embedify(`What do you want the description to be?`));

						messageCollecting();
					});

					function messageCollecting() {
						const messageCollector = m.channel.createMessageCollector(
							(me) => me.author.id === message.author.id && me.channel === m.channel,
							{
								time: 300 * 1000,
							}
						);
						messageCollector.on("collect", (collected) => {
							const configQuestions =
								embedPref === 1
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
									: embedPref === 2
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
								collected.channel.send(
									functions.embedify(`**Sending message in:** \`${originalChanel}\`...`)
								);
								messageCollector.stop();
								return;
							}

							m.channel.send(functions.embedify(configQuestions[i]));

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
			const dndEmbed = new Discord.MessageEmbed()
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

			const gameEventEmbed = new Discord.MessageEmbed()
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

			const eventEmbed = new Discord.MessageEmbed()
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
				.send(
					"@everyone",
					embedPref === 1 ? dndEmbed : embedPref === 2 ? gameEventEmbed : eventEmbed
				)
				.then(async (message) => {
					message.react("<:accepted:867150417271324672>");
					message.react("<:unsure:867150452423131166>");
					message.react("<:denied:867150431612436510>");
					message.react("🗑️");

					embedId = message.id;

					scheduleDB.iniateSchedule(embedId);

					// Set a filter to ONLY grab those reactions & discard the reactions from the bot
					const filter = (reaction, user) => {
						return (
							["accepted", "denied", "unsure", "🗑️"].includes(reaction.emoji.name) && !user.bot
						);
					};

					// Create the collector
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
							.setDescription(config[0])
							.setColor("DC143C")
							.addFields(
								{ name: "\u200B", value: "\u200B" },
								{ name: "Campaign:", value: `${config[1]}`, inline: true },
								{ name: "DM:", value: `${config[2]}`, inline: true },
								{ name: "Whereabout:", value: `${config[3]}`, inline: true }, // .schedule [2021-01-01T12:00:00] [description] [campaign] [DM] [whereabout]
								{ name: "\u200B", value: "\u200B" },
								{
									name: `<:accepted:867150417271324672>Accepted (${scheduleInfo[0].length}/${memberCount})`,
									value: scheduleInfo[0].length !== 0 ? scheduleInfo[0] : "-",
									inline: true,
								},
								{
									name: `<:unsure:867150452423131166>Unsure (${scheduleInfo[2].length}/${memberCount})`,
									value: scheduleInfo[2].length !== 0 ? scheduleInfo[2] : "-",
									inline: true,
								},
								{
									name: `<:denied:867150431612436510>Denied (${scheduleInfo[1].length}/${memberCount})`,
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
							.setDescription(config[0])
							.setColor("DC143C")
							.addFields(
								{ name: "\u200B", value: "\u200B" },
								{ name: "Game:", value: `${config[1]}`, inline: true },
								{ name: "Additional Notes:", value: `${config[2]}`, inline: true },
								{ name: "\u200B", value: "\u200B" },
								{
									name: `<:accepted:867150417271324672>Accepted (${scheduleInfo[0].length}/${memberCount})`,
									value: scheduleInfo[0].length !== 0 ? scheduleInfo[0] : "-",
									inline: true,
								},
								{
									name: `<:unsure:867150452423131166>Unsure (${scheduleInfo[2].length}/${memberCount})`,
									value: scheduleInfo[2].length !== 0 ? scheduleInfo[2] : "-",
									inline: true,
								},
								{
									name: `<:denied:867150431612436510>Denied (${scheduleInfo[1].length}/${memberCount})`,
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
							.setDescription(config[0])
							.setColor("DC143C")
							.addFields(
								{ name: "\u200B", value: "\u200B" },
								{ name: "Event:", value: `${config[1]}`, inline: true },
								{ name: "Additional Notes:", value: `${config[2]}`, inline: true },
								{ name: "\u200B", value: "\u200B" },
								{
									name: `<:accepted:867150417271324672>Accepted (${scheduleInfo[0].length}/${memberCount})`,
									value: scheduleInfo[0].length !== 0 ? scheduleInfo[0] : "-",
									inline: true,
								},
								{
									name: `<:unsure:867150452423131166>Unsure (${scheduleInfo[2].length}/${memberCount})`,
									value: scheduleInfo[2].length !== 0 ? scheduleInfo[2] : "-",
									inline: true,
								},
								{
									name: `<:denied:867150431612436510>Denied (${scheduleInfo[1].length}/${memberCount})`,
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

					if (timer1 - 100 >= 0) {
						setTimeout(async () => {
							await scheduleDB.iniateSchedule(embedId);

							const userIds = await scheduleDB.getScheduleIds(embedId);

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
