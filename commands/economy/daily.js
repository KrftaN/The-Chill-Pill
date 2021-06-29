const Discord = require("discord.js");
const economy = require("../../utility/mongodbFramework");

module.exports = {
	name: "daily",
	aliases: ["daily", "dailygp"],
	description: "Getting your daily reward!",
	args: false,
	cooldown: 1,
	async execute(message, args) {
		const date = new Date();

		const day = date.toISOString().slice(0, 10);

		const userDate = await economy.checkUserDate(message.author.id, day, message.author.username);

		if (userDate === false)
			return message.reply("You must wait until next day until you can claim your reward again.");
		//const balance = await economy.addBal(message.author.id, 3000);

		message.channel.send(
			`Your daily reward of **3000** GP has been added to your balance. [Total balance: ${userDate[1]}]`
		);
	},
};
