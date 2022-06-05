const mongoose = require("mongoose");
const mongo = require("../utility/mongo.js");
const { loadCommands } = require("../utility/onReady/loadCommands");
const { prefix } = require("../jsonFiles/config.json");
const { cacheMessages } = require("../utility/onReady/cacheMessages");

module.exports = {
	name: "ready",
	once: true,
	async execute(bot) {
		await loadCommands(bot);
		await cacheMessages(bot);

		await mongo().then(() => {
			try {
				console.log("Connected to mongo!");
			} finally {
				mongoose.connection.close();
			}
		});

		console.log(
			`Connect as ${bot.user.tag}\n-> Ready on ${bot.guilds.cache.size} servers for a total of ${bot.users.cache.size} users`
		);
		bot.user.setActivity(`${prefix}help`, {
			type: "WATCHING",
		});

		return bot;
	},
};
