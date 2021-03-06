const fs = require("fs");

module.exports = {
	name: "slashreload",
	description: "Only creator man shall use this command",
	args: false,
	guildOnly: false,
	creator: true,
	aliases: ["sr"],
	usage: "<the command>",
	cooldown: 0,
	execute(message, args) {
		const commandName = args[0].toLowerCase();
		const command =
			message.client.slashCommands.get(commandName) ||
			message.client.slashCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(
				`There is no command with name or alias \`${commandName}\`, ${message.author}!`
			);
		}
		const commandFolders = fs.readdirSync("./slashCommands");
		const folderName = commandFolders.find((folder) =>
			fs.readdirSync(`./slashCommands/${folder}`).includes(`${command.name}.js`)
		);
		console.log(folderName);
		delete require.cache[require.resolve(`../../slashCommands/${folderName}/${command.name}.js`)];

		try {
			const newCommand = require(`../../slashCommands/${folderName}/${command.name}.js`);
			message.client.slashCommands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
			console.log(`Command ${newCommand.name} was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.send(
				`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
			);
		}
	},
};
