module.exports = {
	name: "ping",
	aliases: ["pong"],
	description: "Ping!",
	cooldown: 3,
	args: false,
	execute(message, args, guild) {
		message.channel.send(`🏓 | Latency is: **${Date.now() - message.createdTimestamp}ms.**`);
	},
};
