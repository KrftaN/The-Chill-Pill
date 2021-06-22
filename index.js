const Discord = require("discord.js");
const { prefix, token } = require("./jsonFiles/config.json");
const mongoose = require("mongoose");
const mongo = require("./utility/mongo.js");
const fs = require("fs");
const levels = require("./miscFiles/levels");

const bot = new Discord.Client();

bot.login(token);

bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
	//Finds the name of the command
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		bot.commands.set(command.name, command);
	}
}

bot.on("ready", async () => {
	console.log("Connect as " + bot.user.tag);
	levels(bot)

	await mongo().then(() => {
		try {
			console.log("Connected to mongo!");
		} finally {
			mongoose.connection.close();
		}
	});

	bot.user.setActivity(".help", {
		type: "WATCHING",
	});
});

bot.on("message", async (message) => {
	try {
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command =
			bot.commands.get(commandName) ||
			bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		if (command.guildOnly && message.channel.type === "dm")
			return message.reply("I can't execute that command inside DMs!");

		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				if (message.author.id !== "344834268742156298") {
					return message.reply("YOU DO NOT HAVE PERMISSION (git gud scrub)");
				}
			}
		}

		if (
			message.author.id !== "344834268742156298" &&
			(command.name === "addbal" || command.name === "reload")
		) {
			return message.reply("Only creator man shall use this command!");
		}

		if (command.args === true && !args.length) {
			let reply = `You didn't provide a valid arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
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
			command.execute(message, args);
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log(err);
	}
});
