const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "roll",
	aliases: [],
	description: "This is a description",
	args: false,
	usage: "<ex: 1d20> <optinal: + or - > <number of change> ",
	minArgs: 1,
	maxArgs: 3,
	cooldown: 1,
	usage: "<1d20 + x>",
	execute(message, args) {
		function add(accumulator, a) {
			return accumulator + a;
		}

		const amount = Number(args[0].slice(0, args[0].indexOf("d")));

		const dice = Number(args[0].slice(args[0].indexOf("d") + 1));

		const embed1 = new MessageEmbed()
			.setTitle("❌ Invalid input! ❌")
			.setColor("#FFFF00")
			.setDescription("Example: `roll 4d6 + 5` || `roll 1d20`")
			.setTimestamp(new Date());

		const embed2 = new MessageEmbed()
			.setTitle("❌ Invalid input! ❌")
			.setColor("#FFFF00")
			.setDescription("**Cannot** roll more than 100 dice!")
			.setTimestamp(new Date());

		const embed3 = new MessageEmbed()
			.setTitle("❌ Invalid input! ❌")
			.setColor("#FFFF00")
			.setDescription("**Cannot** roll a die with more than 100 sides!")
			.setTimestamp(new Date());

		if (!amount || !dice)
			return message.channel.send({
				embeds: [embed1],
			});

		if (amount > 100)
			return message.channel.send({
				embeds: [embed2],
			});

		if (dice > 100)
			return message.channel.send({
				embeds: [embed3],
			});

		let result = [...Array(amount)].map(() => Math.floor(Math.random() * dice) + 1);

		let sum =
			args.length > 2 && args[1] === "+"
				? result.reduce(add, 0) + Number(args[2])
				: args.length > 2 && args[1] === "-"
				? result.reduce(add, 0) - Number(args[2])
				: result.reduce(add, 0);

		const embed4 = new MessageEmbed()
			.setTitle("🎲Rolling Dice🎲")
			.setColor("#DC143C")
			.setDescription(`[**${args[0]}** : ${result.join(" | ")}] \n **The Sum: \`${sum}\`**`)
			.setTimestamp(new Date());

		message.channel.send({ embeds: [embed4] });
	},
};
