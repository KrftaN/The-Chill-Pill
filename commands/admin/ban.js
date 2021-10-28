module.exports = {
	name: "ban",
	aliases: ["b"],
	description: "BAN naughty users!",
	args: true,
	guildOnly: true,
	permissions: "ADMINISTRATOR",
	cooldown: 0,
	minArgs: 2,
	usage: " <user> <reason for ban>",
	execute(message, args, text) {
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
					.ban({
						reason: text,
					})
					.then(() => {
						message.reply(`Sucessfully banned ${mentionedUser.tag}`);
					})
					.catch((err) => {
						message.reply(`I was unable to ban ${mentionedUser.tag}`);
						console.log(err);
					});
			}
		}
	},
};
