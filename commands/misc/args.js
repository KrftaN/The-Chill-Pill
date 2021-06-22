module.exports = {
	name: "args",
	aliases: ["ar", "arguments"],
	description: "Information about the arguments provided.",
	args: false,
	permissions: "ADMINISTRATOR",
	cooldown: 1,
	usage: "<user>",
	execute(message, args) {
		if (args[0] === "foo") {
			return message.channel.send("bar");
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
