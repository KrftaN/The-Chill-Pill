module.exports = {
	name: "kick",
	description: "Kicking naughty users!",
	args: false,
	aliases: ["k"],
	guildOnly: true,
	cooldown: 0,
	minArgs: 2,
	admin: true,
	permissions: "ADMINISTRATOR",
	usage: "<user> <reason>",
	execute(message, args) {
		const target = message.mentions.members.first();

		if (!target) return message.channel.send("Please specify a user. ❌");

		if (!target.kickable) return message.channel.send("Unable to kick this user. ❌");

		const reason = args.join(" ");

		target.kick(reason)//.then(message.channel.send(`You successfully kicked ${target}.`));  
	},
};
