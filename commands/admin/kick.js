module.exports = {
	name: "kick",
	description: "Kicking naughty users!",
	args: true,
	guildOnly: true,
	cooldown: 0,
	maxArgs: 1,
	minArgs: 1,
	permissions: "ADMINISTRATOR",
	usage: " <user>",
	execute(message, args) {
		const mentionedUser = message.mentions.users.first();
		const member = message.guild.member(mentionedUser);

		if (
			message.author.id !== "344834268742156298" &&
			!message.member.hasPermission(
				"ADMINISTRATOR",
				(explicit = true) && message.author.id !== "344834268742156298"
			)
		)
			return message.channel.send("YOU DO NOT HAVE PERMISSION (git gud scrub)");

		if (mentionedUser) {
			if (member) {
				member
					.kick("You were kicked")
					.then(() => {
						message.reply(`Sucessfully kicked ${mentionedUser.tag}`);
					})
					.catch((err) => {
						message.reply(`I was unable to kick ${mentionedUser.tag}`);
						console.log(err);
					});
			}
		}
	},
};
