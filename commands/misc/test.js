module.exports = {
	name: "test",
	aliases: ["test", "t"],
	description: "testing!",
	cooldown: 0,
	args: false,
	execute(message, args, guild) {
		console.log(message);

		message.channel.send(message.author.avatarURL());
	},
};
