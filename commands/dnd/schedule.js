const { DateTime } = require("luxon");
const Discord = require("discord.js");
const Fs = require("fs");
const schedule = JSON.parse(Fs.readFileSync("./jsonFiles/schedule.json"));
const bot = new Discord.Client();
const scheduleDB = require("../../utility/mongodbFramwork");

module.exports = {
	name: "schedule",
	aliases: ["schedule", "s"],
	description: "",
	args: true,
	minArgs: 1,
	cooldown: 1,
	usage: "<2000-01-01T12:00:00>",
	execute(message, args) {
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

		const msgSender = message.author.username;
		const msgSenderID = message.author.id; // bot.users.cache.get(id).send("Hello this is a test")
		const time = 60000;

		let {
			guild: { memberCount },
		} = message;
		if (isNaN(timer1, timer2)) {
			return message.reply("That is not correctly formatted, example: `<2000-01-01T12:00:00>`");
		}

		const configQuestions = [
			"What do you want the description to be?",
			"What campaign are you playing?",
			"Who is the DM?",
			"What is the whereabout of the session?",
		];

		let config = [];

		const getConfig = new Promise((resolve, reject) => {
			let i = 0;
			let userData;
			let originalChanel;
			message.author.send("What do you want the description to be?").then((m) => {
				originalChanel = message.channel.name;
				const collector = m.channel.createMessageCollector(
					(me) => me.author.id === message.author.id && me.channel === m.channel,
					{ max: configQuestions.length, time: 120 * 1000 }
				);
				collector.on("collect", (collected) => {
					if (collected.content === "end") return collector.stop();
					//basically if you want to stop all the prompts and do nothing
					i += 1;

					userData = collected.channel;

					config.push(collected.content);
					if (i === 1) return collected.channel.send("What campaign are you playing?"); //next prompt
					if (i === 2) return collected.channel.send("Who is the DM?"); //and so on until you get to the last prompt
					if (i === 3) return collected.channel.send("What is the whereabout of the session?"); //next prompt
				});
				collector.on("end", (collected, reason) => {
					if (reason === "time")
						return (
							reject(),
							message.author.send(
								`You ran out of time. Write \`.schedule <time>\` to reinitiate this command. `
							)
						);

					return (
						resolve(),
						config,
						collector.stop(),
						userData.send(`**Sending message in:** \`${originalChanel}\`...`)
					);
				});
			});
		});

		// Sending the acutal embed

		function firstExecution() {
			const scheduleEmbed = new Discord.MessageEmbed()
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
						name: `Accepted (${schedule.accepted.length}/${memberCount - 2})`,
						value: "-",
						inline: true,
					},
					{
						name: `Denied (${schedule.denied.length}/${memberCount - 2})`,
						value: "-",
						inline: true,
					},
					{
						name: `Tentative (${schedule.tentative.length}/${memberCount - 2})`,
						value: "-",
						inline: true,
					}
				)
				.setFooter(`This message was issued by ${msgSender}`)
				.setTimestamp(new Date());
			message.channel.bulkDelete(1);

			message.channel.send("@everyone", scheduleEmbed).then(async (message) => {
				message.react("✅");
				message.react("❌");
				message.react("❔");

				scheduleDB.iniateSchedule(message.id);

				// Set a filter to ONLY grab those reactions & discard the reactions from the bot
				const filter = (reaction, user) => {
					return ["✅", "❌", "❔"].includes(reaction.emoji.name) && !user.bot;
				};

				// Create the collector
				const collector = message.createReactionCollector(filter, {
					time: timer2, //timer2
				});

				collector.on("collect", async (reaction, user) => {
					reaction.users.remove(user);

					const emoji = reaction._emoji.name;

					const emojiName = emoji === "✅" ? "accepted" : emoji === "❌" ? "denied" : "tentative";

					schedule[emojiName].push(user.username);

					const {
						message: { id },
					} = reaction;

					const scheduleInfo = await scheduleDB.changeSchedule(
						id,
						user.username,
						user.id,
						emojiName
					);

					const upateScheduleEmbed = new Discord.MessageEmbed()
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
								name: `Accepted (${schedule.accepted.length}/${memberCount - 2})`,
								value: scheduleInfo[0].length !== 0 ? scheduleInfo[0] : "-",
								inline: true,
							},
							{
								name: `Denied (${schedule.denied.length}/${memberCount - 2})`,
								value: scheduleInfo[1].length !== 0 ? scheduleInfo[1] : "-",
								inline: true,
							},
							{
								name: `Tentative (${schedule.tentative.length}/${memberCount - 2})`,
								value: scheduleInfo[2].length !== 0 ? scheduleInfo[2] : "-",
								inline: true,
							}
						)
						.setFooter(`This message was issued by ${msgSender}`)
						.setTimestamp(new Date());

					message.edit("@everyone", upateScheduleEmbed);
				});

				collector.on("end", (reason) => {});

				setTimeout(() => {
					schedule.acceptedIDs.forEach((id) =>
						bot.users.cache.get(id).send("Hello this is a test")
					);
				}, timer1);
			});
		}

		function handleRejected() {
			return;
		}

		//	getConfig.then(firstExecution, handleRejected);

		firstExecution();

		Fs.writeFileSync("./jsonFiles/schedule.json", JSON.stringify(schedule));
	},
};
