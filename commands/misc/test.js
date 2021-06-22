const Discord = require("discord.js");

const bot = new Discord.Client();

module.exports = {
	name: "test",
	aliases: ["test"],
	description: "testing!",
	cooldown: 0,
	args: false,
	execute(message, args) {
		const questions = ["What is your name?", "How old are you?", "What country are you from?"];
		const id = message.author.id;

		let counter = 0;

		const filter = (m) => {
			return m.author.id === message.author.id;
		};

		const collector = new Discord.MessageCollector(bot.users.fetch(id, false), filter, {
			max: questions.length,
			time: 1000 * 120, // 15s
		});

		bot.users.fetch(id, false).then((user) => {
			user.send(questions[counter++]);
		});
		collector.on("collect", (m) => {
			if (counter < questions.length) {
				bot.users.fetch(id, false).then((user) => {
					user.send(questions[counter++]);
				});
			}
		});

		collector.on("end", (collected) => {
			console.log(`Collected ${collected.size} messages`);

			if (collected.size < questions.length) {
				bot.users.fetch(id, false).then((user) => {
					user.send("You did not answer the questions in time");
				});
				return;
			}

			let counter = 0;
			collected.forEach((value) => {
				console.log(questions[counter++], value.content);
			});
		});
	},
};
