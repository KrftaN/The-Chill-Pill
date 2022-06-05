const { prefix, mongoPath } = require("../jsonFiles/config.json");
const Levels = require("discord-xp");
const { Collection } = require("discord.js");
const mongo = require("../utility/mongo.js");

module.exports = {
	name: "messageCreate",
	async execute(message, bot) {
		if (message.channel.type === "DM" && !message.author.bot) {
			console.log(`${message.content}\n${message.author.tag}`);
		}

		const arguments = message.content.toLowerCase().trim().split(/ +/);

		if (arguments.includes("balls") || arguments.includes("ball")) {
			message.react("❤️");
		}

		if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "DM")
			return;

		try {
			await mongo().then(async () => {
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
				setTimeout(() => message.delete(), 10 * 1000);
				return message.channel.send(reply).then((message) => {
					setTimeout(() => message.delete(), 10 * 1000);
				});
			}

			const { cooldowns } = bot;

			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown ?? 1) * 1000;

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
				command.execute(message, args, bot);
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.log(err);
		}
	},
};
