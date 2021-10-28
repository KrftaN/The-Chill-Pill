module.exports = {
	name: "roast",
	aliases: [],
	description: "Epically roast your friends",
	args: true,
	guildOnly: true,
	minArgs: 1,
	cooldown: 1,
	usage: "<@person you want to roast.>",
	execute(message, args, guild) {
		console.log(args[0]);

		switch (args[0]) {
			case "<@!344834268742156298>":
				message.reply("is still retarded");
				break;

			case "me":
				message.channel.send(`${message.author.username} suck.`);
				break;

			case "yourself":
				message.channel.send("I suck");
				break;

			default:
				message.channel.send(`${args[0]} is a retard`);
				break;
		}
	},
};
