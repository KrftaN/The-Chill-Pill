const Discord = require("discord.js");

const bot = new Discord.Client();

const { token } = require("../../jsonFiles/config.json");

bot.login(token);

module.exports = {
	name: "test",
	aliases: ["test", "t"],
	description: "testing!",
	cooldown: 0,
	args: false,
	execute(message, args, guild) {
		const dateNow = DateTime.now().setZone("Europe/Stockholm").toMillis();
		const dateThen = DateTime.fromISO(
			`${dateNow.fromMillis().toISO().slice(0, 10)}T${args[1]}`
		).toMillis(); // 2021-06-18T14:30:00
	},
};
