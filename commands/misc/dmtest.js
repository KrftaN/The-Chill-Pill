const Discord = require("discord.js");

const bot = new Discord.Client();

bot.login("Njk0Nzg3NjM4NzAzNDIzNDg4.XpqnlQ.PrWtq3UnRUjSvnqr4NsCrfqJ-qE");

module.exports = {
	name: "dmtest",
	aliases: ["name1", "name2"],
	description: "This is a description",
	args: false,
	execute(message, args) {
		bot.users.fetch(id, false).then((user) => {user.send("heloo");});
	},
};
