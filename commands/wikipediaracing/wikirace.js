const Discord = require("discord.js");
const dataBase = require("../../utility/mongodbFramework");
const functions = require("../../utility/functions");

const { prefix } = require("../../jsonFiles/config.json");

module.exports = {
	name: "wikirace",
	aliases: ["wrace", "wikipediarace"],
	description: "checks the users balance",
	args: true,
	minArgs: 1,
	maxArgs: 1,
	cooldown: 0,
	usage: "<the amount of points it cost to enter the race>",
	async execute(message, args, guild) {
		try {
			if (args[0] > 20)
				return message
					.reply(`You cannot start a race with a buy in higher than 20 WikiPoints! ❌`)
					.then((msg) => {
						setTimeout(() => msg.delete(), 7.5 * 1000);
					});

			if (functions.onlyNumbers(args[0]) === false)
				return message
					.reply(
						`\nThe proper usage would be: \`${prefix}wikirace <the amount of points it cost to enter the race>\``
					)
					.then((msg) => {
						setTimeout(() => msg.delete(), 7.5 * 1000);
					});

			const emoticons = {
				1: "1️⃣",
				2: "2️⃣",
				3: "3️⃣",
				4: "4️⃣",
				5: "5️⃣",
				6: "6️⃣",
				7: "7️⃣",
				8: "8️⃣",
				9: "9️⃣",
				10: "🔟",
				e: "🇪",
				s: "🇸",
			};

			const numbersObj = {
				"1️⃣": 1,
				"2️⃣": 2,
				"3️⃣": 3,
				"4️⃣": 4,
				"5️⃣": 5,
				"6️⃣": 6,
				"7️⃣": 7,
				"8️⃣": 8,
				"9️⃣": 9,
				"🔟": 10,
			};

			const numberEmoticonArr = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

			let emoticonsArr = new Array();
			let participants = new Array();
			let participantsIdsArr = new Array();
			let participantsIdsObj = new Object();
			let started = false;

			const buyIn = args[0];

			function removeCharacter(a) {
				return a.replace(/:/g, "");
			}

			const embed = new Discord.MessageEmbed() // This checks your own balance
				.setColor("#DC143C")
				.setTitle("🏎️ Wikipedia Race! 🏎️ | Waiting For Players...")
				.setDescription('Press "S" to start the race and "E" to enter.')
				.addFields(
					{ name: "Pot", value: `0`, inline: true },
					{ name: "Buy in", value: `${buyIn}`, inline: true },
					{ name: "Participants", value: "-" }
				)
				.setTimestamp(new Date())
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/628172806755975168/968931425317449758/unknown.png"
				);

			message.channel.send({ embeds: [embed] }).then((m) => {
				m.react(emoticons.e);
				m.react(emoticons.s);

				Object.entries(emoticons).map((emoticon) => {
					emoticonsArr.push(emoticon[1]);
				});

				const reactionFilter = (reaction, user) => {
					return emoticonsArr.includes(reaction.emoji.name) && !user.bot;
				};

				const collector = m.createReactionCollector({ filter: reactionFilter, time: 7200000 });

				collector.on("collect", async (reaction, user) => {
					reaction.users.remove(user);

					if (reaction.emoji.name === emoticons.e && started === false) {
						const bal = await dataBase.getWiki(user.id, user.username);

						if (bal < buyIn)
							return message.channel
								.send(`${user}, You do not have enough WikiPoints to partake in this race!❌`)
								.then((msg) => {
									setTimeout(() => msg.delete(), 7.5 * 1000);
								});

						if (participants.length > 10)
							return message.channel
								.send(`${user}, 10 is the **max** amount of participants. `)
								.then((msg) => {
									setTimeout(() => msg.delete(), 7.5 * 1000);
								});

						if (participants.includes(user.tag) === false) {
							participants.push(user.tag);
							participantsIdsArr.push(user.id);
							participantsIdsObj[user.tag] = user.id;
						} else {
							participants = participants.filter((e) => e !== user.tag);
							participantsIdsArr = participantsIdsArr.filter((e) => e !== user.id);
							delete participantsIdsObj[user.tag];
						}

						const updatedEmbed = new Discord.MessageEmbed() // This checks your own balance
							.setColor("#DC143C")
							.setTitle("🏎️ Wikipedia Race! 🏎️")
							.setDescription('Press "S" to start the race and "E" to enter.')
							.addFields(
								{ name: "Pot", value: `${buyIn * participants.length}`, inline: true },
								{ name: "Buy in", value: `${buyIn}`, inline: true },
								{
									name: "Participants",
									value: participants.length !== 0 ? participants.join("\n") : "-",
								}
							)

							.setTimestamp(new Date())
							.setThumbnail(
								"https://cdn.discordapp.com/attachments/628172806755975168/968931425317449758/unknown.png"
							);

						m.edit({ embeds: [updatedEmbed] });
					} else if (reaction.emoji.name === emoticons.s && started === false) {
						started = true;

						if (message.author.id !== user.id)
							return message.channel
								.send(`${user}, Only the user that initiated the race can start it!`)
								.then((msg) => {
									setTimeout(() => msg.delete(), 7.5 * 1000);
								});
						if (participants.length < 2)
							return message.channel
								.send(`${user}, There needs to be **at least 2** participants to start a race.`)
								.then((msg) => {
									setTimeout(() => msg.delete(), 7.5 * 1000);
								});

						m.reactions
							.removeAll()
							.catch((error) => console.error("Failed to clear reactions: ", error));

						const updatedEmbed = new Discord.MessageEmbed()
							.setColor("#00FF00")
							.setTitle("🏎️ Wikipedia Race! 🏎️ | Ongoing...")
							.setDescription(
								'Press "S" to start the race and "E" to enter.\n\n To announce the winner, react with the users corresponding number.'
							)
							.addFields(
								{ name: "Pot", value: `${buyIn * participants.length}`, inline: true },
								{ name: "Buy in", value: `${buyIn}`, inline: true },
								{
									name: "Participants",
									value: participants.length !== 0 ? participants.join("\n") : "-",
								}
							)

							.setTimestamp(new Date())
							.setThumbnail(
								"https://cdn.discordapp.com/attachments/628172806755975168/968931425317449758/unknown.png"
							);

						m.edit({ embeds: [updatedEmbed] });

						for (let i = 0; participants.length > i; i++) {
							m.react(emoticons[i + 1]);
						}
					}

					if (numberEmoticonArr.includes(reaction.emoji.name) && started === true) {
						const winner = participantsIdsObj[participants[numbersObj[reaction.emoji.name] - 1]];

						if (numbersObj[reaction.emoji.name] > participants.length + 1) return;

						dataBase.wikiRacePointDistrubtion(
							winner,
							buyIn * participants.length,
							buyIn,
							participantsIdsArr.filter((e) => e !== winner)
						);

						const updatedEmbed = new Discord.MessageEmbed()
							.setColor("#0000FF")
							.setTitle("🏎️ Wikipedia Race! 🏎️ | Completed...")
							.setDescription(
								`The Race has ended and ${participants[numbersObj[reaction.emoji.name] - 1]} won!`
							)
							.addFields(
								{ name: "Pot", value: `${buyIn * participants.length}`, inline: true },
								{
									name: "Winner",
									value: `${participants[numbersObj[reaction.emoji.name] - 1]}`,
									inline: true,
								},
								{
									name: "All Participants",
									value: participants.length !== 0 ? participants.join("\n") : "-",
								}
							)

							.setTimestamp(new Date())
							.setThumbnail(
								"https://cdn.discordapp.com/attachments/628172806755975168/968931425317449758/unknown.png"
							);

						m.edit({ embeds: [updatedEmbed] });

						collector.stop();
					}
				});

				collector.on("end", (collected, reason) => {
					m.reactions
						.removeAll()
						.catch((error) => console.error("Failed to clear reactions: ", error));

					if (reason === "time") {
						m.edit("A WikiRace can't be longer than 2 hours!");
					}
				});
			});
		} catch (error) {
			console.log(error);
		}
	},
};
