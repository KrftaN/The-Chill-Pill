const { checkUserDate } = require("../../utility/database-functions/economy/checkUserDate");

module.exports = {
	name: "daily",
	aliases: ["dailygp"],
	description: "Getting your daily reward!",
	args: false,
	cooldown: 1,
	async execute(message, args) {
		const date = new Date();

		const day = date.toISOString().slice(0, 10);

		const userDate = await checkUserDate(message.author.id, day, message.author.username);

		if (userDate === false)
			return message.reply(
				"You must wait until next day until you can claim your reward again. ❌"
			);

		message.channel.send(
			`Your daily reward of **3000** GP has been added to your balance. \`Total balance: ${userDate[1]}\`✔️`
		);
	},
};
