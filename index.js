const Discord = ({ Client, Intents } = require("discord.js"));

const intents = new Discord.Intents(32767);
const bot = new Client({ intents });
const { prefix, token, mongoPath } = require("./jsonFiles/config.json");
const mongoose = require("mongoose");
const mongo = require("./utility/mongo.js");
const welcome = require("./commands/configuration/welcome");
const guildSchema = require("./schemas/guildSchema");
const fs = require("fs");
const Levels = require("discord-xp");
const { Player } = require("discord-player");
const joinCache = {};
const leaveCache = {};

bot.login(token);

bot.config = require("./config");
bot.player = new Player(bot, bot.config.opt.discordPlayer);
const player = bot.player;

bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync("./commands");

let objectOfcommandAndFolders = new Object();

console.log("Loading commands...");
for (const folder of commandFolders) {
	//Finds the name of the command
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		bot.commands.set(command.name, command);

		console.log(`-> Loaded command ${command.name}`);

		if (!objectOfcommandAndFolders[folder]) {
			objectOfcommandAndFolders[folder] = new Array();
		}

		objectOfcommandAndFolders[folder].push(command.name);
	}
}

/* bot.on("guildMemberAdd", async (member) => {
	const { guild, user } = member;

	const guildId = guild.id;

	let data = joinCache[guild.id];

	const validationJoinCache = welcome.validationJoinCache || data;

	const validation = validationJoinCache[guild.id]; 

		const validation = !welcome.validationJoinCache[guild.id]
		? data
		: welcome.validationJoinCache[guild.id];

	if (data !== validation) {
		await mongo().then(async (mongoose) => {
			try {
				const result = await guildSchema.findOne({ guildId });

				console.log("I got here!");

				joinCache[guild.id] = data = !result ? "non existent" : [result.channelId, result.message];
			} finally {
				mongoose.connection.close();
			}
		});
	}

	if (data === "non existent") return;

	const embed = new Discord.MessageEmbed()
		.setTitle(`\`${user.username}#${user.discriminator}\` just joined \`${guild.name}\``)
		.setColor("#00FF00")
		.setDescription(`${data[1]}`)
		.setFooter(user.avatarURL())
		.setTimestamp(new Date());

	bot.channels.cache
		.get(data[0])
		.send({ content: member, embeds: [embed] })
		.then((message) => {
			message.edit({ embeds: [embed] });
		});
}); */

bot.on("guildMemberRemove", async (member) => {
	const { guild, user } = member;

	const guildId = guild.id;

	let data = leaveCache[guild.id];

	if (!data) {
		await mongo().then(async (mongoose) => {
			try {
				const result = await guildSchema.findOne({ guildId });

				leaveCache[guild.id] = data = !result
					? "non existent"
					: [result.channelId, result.leaveMessage];
			} finally {
				mongoose.connection.close();
			}
		});
	}

	if (data === "non existent") return;

	const embed = new Discord.MessageEmbed()
		.setTitle(`\`${user.tag}\` just left \`${guild.name}\``)
		.setColor("#DC143C")
		.setDescription(`${data[1]}`)
		.setFooter(user.avatarURL())
		.setTimestamp(new Date());

	bot.channels.cache
		.get(data[0])
		.send({ content: member, embeds: [embed] })
		.then((message) => {
			message.edit({ embeds: [embed] });
		});
});

bot.on("ready", async () => {
	console.log(
		`Connect as ${bot.user.tag}\n-> Ready on ${bot.guilds.cache.size} servers for a total of ${bot.users.cache.size} users`
	);

	await mongo().then(() => {
		try {
			console.log("Connected to mongo!");
		} finally {
			mongoose.connection.close();
		}
	});

	bot.user.setActivity(`${prefix}help`, {
		type: "WATCHING",
	});
});

bot.on("messageCreate", async (message) => {
	if (message.channel.type === "DM") {
		console.log(message.content);
	}

	if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "DM")
		return;
	const arguments = message.content.trim().split(/ +/);

	if (arguments.includes("balls")) {
		message.react("❤️");
	}

	try {
		await mongo().then(async (mongoose) => {
			Levels.setURL(mongoPath);

			const randomAmountOfXp = Math.floor(Math.random() * 20) + 1; // Min 1, Max 20
			const hasLeveledUp = await Levels.appendXp(
				message.author.id,
				message.guild.id,
				randomAmountOfXp
			);
			if (hasLeveledUp) {
				const user = await Levels.fetch(message.author.id, message.guild.id);
				message.channel.send(
					`${message.author}, congratulations! You have leveled up to **${user.level}** in \`${message.guild.name}\` :sunglasses:`
				);
			}
		});

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command =
			bot.commands.get(commandName) ||
			bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		if (command.guildOnly && message.channel.type === "DM")
			return message.reply("I can't execute that command inside DMs!");

		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				if (message.author.id !== "344834268742156298") {
					return message.reply("YOU DO NOT HAVE PERMISSION (git gud scrub)");
				}
			}
		}

		if (command.voiceChannel === true) {
			if (!message.member.voice.channel)
				return message.channel.send(
					`${message.author}, You are not connected to an audio channel. ❌`
				);
			if (
				message.guild.me.voice.channel &&
				message.member.voice.channel.id !== message.guild.me.voice.channel.id
			)
				return message.channel.send(
					`${message.author}, You are not on the same audio channel as me. ❌`
				);
		}

		if (command.creator === true && message.author.id !== "344834268742156298")
			return message.reply("Wait what, you are not creator man, you cannot use the command!!!!!");

		if (command.args === true && !args.length) {
			let reply = `You didn't provide a valid arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}
			setTimeout(() => message.delete(), 25 * 1000);
			return message.channel.send(reply).then((message) => {
				setTimeout(() => message.delete(), 25 * 1000);
			});
		}

		const { cooldowns } = bot;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown ?? 1.5) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(
					`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
						command.name
					}\` command.`
				);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		const maxArguments = command.maxArgs || null;

		if (
			args.length < command.minArgs ||
			(maxArguments !== null && command.args === "true" && args.length > command.maxArgs)
		) {
			let reply = `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			return message.channel.send(reply);
		}

		try {
			command.execute(message, args, message.guild, bot, objectOfcommandAndFolders);
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log(err);
	}
});

player.on("error", (queue, error) => {
	console.log(`There was a problem with the song queue => ${error.message}`);
});

player.on("connectionError", (queue, error) => {
	console.log(`I'm having trouble connecting => ${error.message}`);
});

player.on("trackStart", (queue, track) => {
	if (!bot.config.opt.loopMessage && queue.repeatMode !== 0) return;
	queue.metadata.send(
		`🎵 Music started playing: **${track.title}** -> Channel: **${queue.connection.channel.name}** 🎧`
	);
});

player.on("trackAdd", (queue, track) => {
	queue.metadata.send(`**${track.title}** added to playlist. ✅`);
});

player.on("botDisconnect", (queue) => {
	queue.metadata.send("I got kicked, the whole playlist has been cleared! ❌");
});

player.on("channelEmpty", (queue) => {
	queue.metadata.send("I left due to inactivity ❌");
});

player.on("queueEnd", (queue) => {
	queue.metadata.send("Queue is finished. ✅");
});
