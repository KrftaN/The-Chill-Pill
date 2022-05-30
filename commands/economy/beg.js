const { addBal } = require("../../utility/database-functions/economy/addBal");

module.exports = {
	name: "beg",
	aliases: [],
	description: "You poor begger!!",
	args: false,
	maxArgs: 0,
	cooldown: 30,
	execute(message, args) {
		const randomNumber = Math.floor(Math.random() * 250);

		if (Math.floor(Math.random() * 100) + 1 >= 25) {
			addBal(message.author.id, randomNumber, message.author.username);

			message.channel.send(`You begged and someone gave you ${randomNumber}GP`);
		} else {
			message.channel.send("You begged for many long hours but no one spared a single CP to you.");
		}
	},
};
