const deploy = require("../onReady/deploy");
const Discord = require("discord.js");
const fs = require("fs");

module.exports.loadCommands = async (bot) => {
	bot.commands = new Discord.Collection();
	bot.slashCommands = new Discord.Collection();
	bot.commandAndFolders = new Object();
	bot.slashCommandAndFolders = new Object();

	const commandFolders = fs.readdirSync("./commands");
	const slashCommandFolders = fs.readdirSync("./slashCommands");

	console.log("Loading commands...");
	for (const folder of commandFolders) {
		//Finds the name of the command
		const commandFiles = fs
			.readdirSync(`./commands/${folder}`)
			.filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`../../commands/${folder}/${file}`);
			bot.commands.set(command.name, command);

			console.log(`-> Loaded command ${command.name}`);

			if (!bot.commandAndFolders[folder]) {
				bot.commandAndFolders[folder] = new Array();
			}

			bot.commandAndFolders[folder].push(command.name);
		}
	}

	await deploy.deploy(bot).then(() => {
		console.log("Loading slash commands...");
		for (const folder of slashCommandFolders) {
			const slashCommandFiles = fs
				.readdirSync(`./slashCommands/${folder}`)
				.filter((file) => file.endsWith(".js"));
			for (const file of slashCommandFiles) {
				const command = require(`../../slashCommands/${folder}/${file}`);
				bot.slashCommands.set(command.data.name, command);

				console.log(`-> Loaded command ${command.data.name}`);

				if (!bot.slashCommandAndFolders[folder]) {
					bot.slashCommandAndFolders[folder] = new Array();
				}

				bot.slashCommandAndFolders[folder].push(command.name);
			}
		}
	});
	console.log("\n");
	return bot;
};
