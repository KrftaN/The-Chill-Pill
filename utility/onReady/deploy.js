const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { guildId, token } = require("../../jsonFiles/config.json");

module.exports.deploy = async (bot) => {
	const commands = new Array();
	const CommandFolders = fs.readdirSync("./slashCommands");

	for (const folder of CommandFolders) {
		//Finds the name of the command
		const slashCommandFiles = fs
			.readdirSync(`./slashCommands/${folder}`)
			.filter((file) => file.endsWith(".js"));
		for (const file of slashCommandFiles) {
			const command = require(`../../slashCommands/${folder}/${file}`);
			commands.push(command.data.toJSON());
		}
	}

	const rest = new REST({ version: "9" }).setToken(token);

	rest
		.put(Routes.applicationGuildCommands(bot.user.id, guildId), { body: commands })
		.then(() => console.log("-> Successfully registered application commands."))
		.catch(console.error);
};
/* 
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { guildId, token } = require("../../jsonFiles/config.json");

module.exports.deploy = async (bot) => {
	const commands = new Array();
	const CommandFolders = fs.readdirSync("./slashCommands");

	for (const folder of CommandFolders) {
		//Finds the name of the command
		const slashCommandFiles = fs
			.readdirSync(`./slashCommands/${folder}`)
			.filter((file) => file.endsWith(".js"));
		for (const file of slashCommandFiles) {
			const command = require(`../../slashCommands/${folder}/${file}`);
			commands.push(command.data.toJSON());
		}
	}

	const rest = new REST({ version: "9" }).setToken(token);

	rest
		.put(
	Routes.applicationCommands(bot.user.id),
	{ body: commands })
		.then(() => console.log("Successfully registered application commands."))
		.catch(console.error);
};
 */
