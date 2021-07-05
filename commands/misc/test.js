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
		const configQuestions = ["Question 2", "Question 3", "Question 4"];
		let config = [];

		let i = 0;
		let userData;

		message.author.send("Question 1").then((m) => {
			const collector = m.channel.createMessageCollector(
				(me) => me.author.id === message.author.id && me.channel === m.channel,
				{
					time: 120 * 1000, // This could be any amount of time
				}
			);
			collector.on("collect", (collected) => {
				config.push(collected.content);
				if (i >= configQuestions.length) {
					collected.channel.send("Stopped collecting");
					collector.stop();
					return;
				}
				collected.channel.send(configQuestions[i]);

				userData = collected.channel;

				i += 1;
			});
			collector.on("end", (collected, reason) => {
				if (reason === "time")
					// This checks if the time ran out
					return message.author.send(
						`You ran out of time. Write \`.command\` to reinitiate this command. `
					);
				console.log(config);
				return config;
			});
		});
	},
};
