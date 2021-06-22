module.exports = {
	name: "roll",
	aliases: ["roll"],
	description: "This is a description",
	args: false,
	usage: "<ex: 1d20> <optinal: + or - > <number of change> ",
	minArgs: 1,
	maxArgs: 3,
	cooldown: 1,
	execute(message, args) {
		try {
			function add(accumulator, a) {
				return accumulator + a;
			}

			const amount = Number(args[0].slice(0, args[0].indexOf("d")));

			const dice = Number(args[0].slice(args[0].indexOf("d") + 1));

			let result = [...Array(amount)]
				.map(() => Math.floor(Math.random() * dice) + 1)
				.sort((a, b) => b - a);

			let sum =
				args.length > 2 && args[1] === "+"
					? result.reduce(add, 0) + Number(args[2])
					: args.length > 2 && args[1] === "-"
					? result.reduce(add, 0) - Number(args[2])
					: result.reduce(add, 0);

			if (!amount || !dice)
				message.channel.send(
					`Mate, make sure you've written everything correctly; .roll [The Amount Of Dice]d[The Dice]" for example 1d20`
				);

			if (result.includes(20) && dice === 20) {
				// Ha! I love this mess of if else statments
				message.channel.send(`You rolled a natural 20. [Rolls: ${result}] Result: ${sum}`);
			} else if (result.includes(1) && dice === 20) {
				message.channel.send(`You just rolled shit mate! [Rolls: ${result}] Result: ${sum}`);
			} else {
				message.channel.send(`[Rolls: ${result}] Result: ${sum}`);
			}
		} catch (err) {
			message.channel.send(
				`Mate, make sure you've written everything correctly; ".roll [The Amount Of Dice]d[The Dice]" for example 1d20`
			);
			console.log(err);
		}
	},
};
